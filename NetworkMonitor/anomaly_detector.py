from database import get_latest_timestamp, get_previous_timestamp, conn

def detect_anomalies():
    latest = get_latest_timestamp()
    if not latest:
        return ["No scans available."]
    
    previous = get_previous_timestamp(latest)
    if not previous:
        return ["No previous scan to compare."]
    
    cursor = conn.cursor()
    latest_scan = cursor.execute('SELECT host, port FROM scans WHERE timestamp = ?', (latest,)).fetchall()
    previous_scan = cursor.execute('SELECT host, port FROM scans WHERE timestamp = ?', (previous,)).fetchall()

    latest_hosts = {host for host, _ in latest_scan}
    previous_hosts = {host for host, _ in previous_scan}
    latest_ports = {(host, port) for host, port in latest_scan}
    previous_ports = {(host, port) for host, port in previous_scan}

    anomalies = []
    # Detect new hosts
    for host in latest_hosts - previous_hosts:
        anomalies.append(f"New host detected: {host}")
    # Detect new open ports
    for host, port in latest_ports - previous_ports:
        anomalies.append(f"New open port {port} on host {host}")

    return anomalies if anomalies else ["No anomalies detected."]