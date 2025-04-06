import sqlite3
from datetime import datetime

# Connect to the database
conn = sqlite3.connect('network_scans.db')
cursor = conn.cursor()

# Create the scans table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME,
        host TEXT,
        port INTEGER,
        state TEXT,
        service TEXT,
        version TEXT
    )
''')

# Create the summaries table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME,
        summary TEXT
    )
''')
conn.commit()

def insert_scan_results(host, port, state, service, version):
    timestamp = datetime.now()
    cursor.execute('''
        INSERT INTO scans (timestamp, host, port, state, service, version)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (timestamp, host, port, state, service, version))
    conn.commit()

def insert_summary(summary):
    timestamp = datetime.now()
    cursor.execute('INSERT INTO summaries (timestamp, summary) VALUES (?, ?)', (timestamp, summary))
    conn.commit()

def get_latest_timestamp():
    cursor.execute('SELECT MAX(timestamp) FROM scans')
    return cursor.fetchone()[0]

def get_previous_timestamp(latest):
    cursor.execute('SELECT MAX(timestamp) FROM scans WHERE timestamp < ?', (latest,))
    result = cursor.fetchone()
    return result[0] if result else None

def get_latest_summary():
    cursor.execute('SELECT summary FROM summaries WHERE timestamp = (SELECT MAX(timestamp) FROM summaries)')
    result = cursor.fetchone()
    return result[0] if result else "No summaries available."
