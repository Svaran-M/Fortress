from fastapi import FastAPI, UploadFile, File
import sqlite3
import speech_recognition as sr
from scanner import scan_network
from anomaly_detector import detect_anomalies
from summarizer import summarize_anomalies
from database import insert_summary, get_latest_summary

app = FastAPI()

def get_db_connection():
    conn = sqlite3.connect('network_scans.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get('/summaries')
def get_summaries():
    conn = get_db_connection()
    summaries = conn.execute('SELECT * FROM summaries ORDER BY timestamp DESC').fetchall()
    conn.close()
    return [dict(row) for row in summaries]

@app.get('/logs')
def get_logs():
    conn = get_db_connection()
    logs = conn.execute('SELECT * FROM scans ORDER BY timestamp DESC').fetchall()
    conn.close()
    return [dict(row) for row in logs]

@app.post('/scan-now')
def trigger_scan():
    scan_network()
    anomalies = detect_anomalies()
    summary = summarize_anomalies(anomalies)
    insert_summary(summary)
    return {"status": "Scan triggered", "summary": summary}

@app.post('/voice-command')
async def voice_command(audio: UploadFile = File(...)):
    # Save audio temporarily
    with open("temp_audio.wav", "wb") as f:
        f.write(await audio.read())
    
    # Recognize speech
    r = sr.Recognizer()
    with sr.AudioFile("temp_audio.wav") as source:
        audio_data = r.record(source)
        try:
            command = r.recognize_google(audio_data)
            command = command.lower()
            if "scan now" in command:
                scan_network()
                anomalies = detect_anomalies()
                summary = summarize_anomalies(anomalies)
                insert_summary(summary)
                return {"action": "scan", "summary": summary}
            elif "what's new" in command:
                summary = get_latest_summary()
                return {"action": "summary", "summary": summary}
            else:
                return {"error": "Command not recognized"}
        except sr.UnknownValueError:
            return {"error": "Could not understand audio"}
        finally:
            # Clean up
            import os
            if os.path.exists("temp_audio.wav"):
                os.remove("temp_audio.wav")