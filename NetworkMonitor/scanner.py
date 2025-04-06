import nmap
import netifaces
from ipaddress import ip_interface
from database import insert_scan_results
from time import time

def get_local_network_range():
    try:
        gateways = netifaces.gateways()
        default_gateway = gateways['default'][netifaces.AF_INET]
        interface = default_gateway[1]
        addrs = netifaces.ifaddresses(interface)
        ipv4_info = addrs[netifaces.AF_INET][0]
        ip_address = ipv4_info['addr']
        netmask = ipv4_info['netmask']
        interface_ip = ip_interface(f"{ip_address}/{netmask}")
        network = interface_ip.network
        return str(network)
    except Exception as e:
        print(f"Error detecting network: {e}")
        # Fallback to a common local range:
        return "192.168.1.0/24"

def scan_network(network_range=None):
    if network_range is None:
        network_range = get_local_network_range()
    print(f"Starting scan of {network_range}...")
    start_time = time()

    nm = nmap.PortScanner()
    nm.scan(hosts=network_range, arguments='-sV')

    print(f"Found {len(nm.all_hosts())} live hosts.")
    for host in nm.all_hosts():
        print(f"Scanning {host}...")
        for proto in nm[host].all_protocols():
            if proto == 'tcp':
                for port in nm[host][proto]:
                    state = nm[host][proto][port]['state']
                    service = nm[host][proto][port]['name']
                    version = nm[host][proto][port]['version']
                    insert_scan_results(host, port, state, service, version)

    end_time = time()
    print(f"Scan completed in {end_time - start_time:.2f} seconds.")
    return "Scan completed."
