def summarize_anomalies(anomalies):
    """
    Summarizes anomaly strings into a concise message.
    Expects a list of strings. Possible values in anomalies:
      - "No scans available."
      - "No previous scan to compare."
      - "No anomalies detected."
      - "New host detected: x.x.x.x"
      - "New open port p on host x.x.x.x"
    """

    # If there are no anomalies or the first message indicates no or insufficient data:
    if (not anomalies or 
        anomalies[0] in ["No scans available.", "No previous scan to compare.", "No anomalies detected."]):
        return "Nothing unusual found on your network."

    summary = "Network changes detected: "
    host_count = 0
    port_count = 0
    details = []

    for anomaly in anomalies:
        if "New host" in anomaly:
            host_count += 1
            details.append(anomaly.split("detected: ")[-1])
        elif "New open port" in anomaly:
            port_count += 1
            details.append(anomaly.split("on host ")[-1])

    # Build summary text
    if host_count > 0:
        summary += f"{host_count} new host{'s' if host_count > 1 else ''} "
    if port_count > 0:
        # Add 'and ' only if we already have host(s)
        if host_count > 0:
            summary += "and "
        summary += f"{port_count} new open port{'s' if port_count > 1 else ''} "

    if details:
        summary += "found, including " + ", ".join(details) + "."

    return summary.strip()

# Test it
if __name__ == "__main__":
    test_anomalies = [
        "New host detected: 10.0.0.50",
        "New open port 80 on host 10.0.0.44",
        "New host detected: 10.0.0.51"
    ]
    print(summarize_anomalies(test_anomalies))
    print(summarize_anomalies(["No previous scan to compare."]))
    print(summarize_anomalies(["No anomalies detected."]))
