from fastapi import FastAPI, BackgroundTasks
from apscheduler.schedulers.background import BackgroundScheduler
from scanner import scan_network
from anomaly_detector import detect_anomalies
from summarizer import summarize_anomalies
from database import insert_summary, get_latest_summary

app = FastAPI()

# Function to perform scan and summarization
def perform_scan_and_summarize():
    try:
        print("Performing scan and summarizing...")
        scan_network()
        anomalies = detect_anomalies()
        summary = summarize_anomalies(anomalies)
        insert_summary(summary)
        print(f"Scan and summary completed: {summary}")
    except Exception as e:
        print(f"Error during scan and summarization: {e}")

# Automated scan every hour
scheduler = BackgroundScheduler()
scheduler.add_job(perform_scan_and_summarize, 'interval', hours=1)

@app.on_event("startup")
async def startup_event():
    scheduler.start()
    print("Scheduler started for hourly scans.")

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    print("Scheduler stopped.")

# API Endpoints
@app.post("/scan")
async def trigger_scan(background_tasks: BackgroundTasks):
    background_tasks.add_task(perform_scan_and_summarize)
    return {"message": "Scan started. Check the summary later."}

@app.get("/summary")
async def get_summary():
    try:
        summary = get_latest_summary()
        return {"summary": summary}
    except Exception as e:
        return {"summary": f"Error retrieving summary: {e}"}

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000