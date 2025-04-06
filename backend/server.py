import requests
import time
import random
import string
import logging
import os
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field 
from dotenv import load_dotenv


load_dotenv() 


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


BASE_URL = os.getenv("MAIL_TM_BASE_URL", "https://api.mail.tm")
REQUEST_TIMEOUT = 15 


class Message(BaseModel):
    id: str
    sender: str = Field(default="unknown@sender.com")
    subject: str = Field(default="(No Subject)")
    receivedAt: str 
    read: bool = False
    intro: Optional[str] = ""

class GenerateEmailResponse(BaseModel):
    email: str
    token: str
    expiresAt: int 

class MessagesResponse(BaseModel):
    messages: List[Message]

class ErrorDetail(BaseModel):
    detail: str


def random_string(length=10):
    """Generates a random string."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def get_domain() -> str:
    """Fetches the first available domain from mail.tm (Synchronous)."""
    logging.info("Attempting to get domain...")
    try:
        res = requests.get(f"{BASE_URL}/domains", timeout=REQUEST_TIMEOUT)
        res.raise_for_status() 
        data = res.json()
        domains = data.get("hydra:member", [])
        if domains and isinstance(domains, list) and len(domains) > 0 and "domain" in domains[0]:
            domain = domains[0]["domain"]
            logging.info(f"Found domain: {domain}")
            return domain
        else:
            logging.warning("No domains found or unexpected format from API.")
            raise HTTPException(status_code=503, detail="Could not retrieve a valid domain from mail provider.")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error getting domain: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to connect to mail provider domains endpoint: {e}")
    except Exception as e:
        logging.error(f"Unexpected error getting domain: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while fetching domains.")

def create_account(domain: str) -> tuple[str, str]:
    """Creates a mail.tm account (Synchronous)."""
    username = random_string()
    email = f"{username}@{domain}"
    password = "TempPass_" + random_string(8) + "!" 
    logging.info(f"Attempting to create account: {email}")

    try:
        payload = {"address": email, "password": password}
        res = requests.post(f"{BASE_URL}/accounts", json=payload, timeout=REQUEST_TIMEOUT)

        if res.status_code == 201:
            logging.info(f"Account created successfully: {email}")
            return email, password
        else:
            logging.error(f"Account creation failed for {email}. Status: {res.status_code}, Response: {res.text}")
            detail_msg = f"Mail provider account creation failed (Status {res.status_code})."
            try: 
                error_data = res.json()
                if "hydra:description" in error_data:
                    detail_msg = f"Mail provider error: {error_data['hydra:description']}"
                elif "detail" in error_data:
                     detail_msg = f"Mail provider error: {error_data['detail']}"
            except Exception:
                pass 
            raise HTTPException(status_code=502, detail=detail_msg)

    except requests.exceptions.RequestException as e:
        logging.error(f"Error creating account {email}: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to connect to mail provider accounts endpoint: {e}")
    except Exception as e:
        logging.error(f"Unexpected error creating account {email}: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during account creation.")

def get_token(email: str, password: str) -> str:
    """Authenticates with mail.tm and gets a JWT token (Synchronous)."""
    logging.info(f"Attempting to get token for: {email}")
    try:
        payload = {"address": email, "password": password}
        res = requests.post(f"{BASE_URL}/token", json=payload, timeout=REQUEST_TIMEOUT)

        if res.status_code == 200:
            data = res.json()
            token = data.get("token")
            if token:
                logging.info(f"Token retrieved successfully for {email}")
                return token
            else:
                logging.error(f"Token retrieval failed for {email}: 'token' key not found.")
                raise HTTPException(status_code=502, detail="Mail provider authentication succeeded but token was missing.")
        elif res.status_code == 401:
             logging.warning(f"Token retrieval failed for {email} (Unauthorized). Status: {res.status_code}, Response: {res.text}")
             raise HTTPException(status_code=401, detail="Mail provider authentication failed (Invalid credentials?).")
        else:
            logging.error(f"Token retrieval failed for {email}. Status: {res.status_code}, Response: {res.text}")
            raise HTTPException(status_code=502, detail=f"Mail provider authentication failed (Status {res.status_code}).")

    except requests.exceptions.RequestException as e:
        logging.error(f"Error getting token for {email}: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to connect to mail provider token endpoint: {e}")
    except Exception as e:
        logging.error(f"Unexpected error getting token for {email}: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during token retrieval.")

def fetch_messages_from_provider(token: str) -> List[Message]:
    """Fetches messages from mail.tm using the token (Synchronous)."""
    logging.info("Attempting to fetch messages from provider...")
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.get(f"{BASE_URL}/messages", headers=headers, timeout=REQUEST_TIMEOUT)

        if res.status_code == 200:
            data = res.json()
            raw_messages = data.get("hydra:member", [])
            logging.info(f"Fetched {len(raw_messages)} raw messages.")

            
            formatted_messages = []
            for msg in raw_messages:
                if not isinstance(msg, dict): continue 
                formatted_messages.append(
                    Message(
                        id=msg.get("id", f"missing_id_{random_string(5)}"),
                        sender=msg.get("from", {}).get("address", "unknown@sender.com"),
                        subject=msg.get("subject", "(No Subject)"),
                        receivedAt=msg.get("createdAt", time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())), # Provide default ISO string
                        read=msg.get("seen", False),
                        intro=msg.get("intro", "")
                    )
                )
            return formatted_messages
        elif res.status_code == 401:
             logging.warning(f"Fetching messages failed (Unauthorized). Status: {res.status_code}")
             raise HTTPException(status_code=401, detail="Invalid or expired token.")
        else:
            logging.error(f"Error fetching messages from provider. Status: {res.status_code}, Response: {res.text}")
            raise HTTPException(status_code=502, detail=f"Failed to fetch messages from mail provider (Status {res.status_code}).")

    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching messages from provider: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to connect to mail provider messages endpoint: {e}")
    except Exception as e:
        logging.error(f"Unexpected error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while fetching messages.")

app = FastAPI(
    title="Temp Email API Proxy",
    description="Proxies requests to mail.tm for temporary email generation and retrieval.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/")
def read_root(): 
    """Root endpoint to check if the server is running."""
    return {"message": "Temporary Email Backend is running!"}

@app.post(
    "/generate_email",
    response_model=GenerateEmailResponse,
    summary="Generate Temporary Email",
    description="Creates a new temporary email account via mail.tm and returns credentials.",
    responses={
        500: {"model": ErrorDetail, "description": "Internal Server Error"},
        502: {"model": ErrorDetail, "description": "Bad Gateway (Mail Provider Error)"},
        503: {"model": ErrorDetail, "description": "Service Unavailable (Mail Provider Connection Error)"}
    }
)
def handle_generate_email(): 
    """Generates a new temporary email address, password, and token."""
    logging.info("Received request for /generate_email")
    try:
        domain = get_domain()
        email, password = create_account(domain)
        token = get_token(email, password)

        expires_at_ms = int((time.time() + 3600) * 1000)

        logging.info(f"Successfully generated email: {email}")
        return GenerateEmailResponse(
            email=email,
            token=token,
            expiresAt=expires_at_ms
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception("Unhandled exception in /generate_email") 
        raise HTTPException(status_code=500, detail=f"An unexpected internal error occurred: {e}")

@app.get(
    "/messages",
    response_model=MessagesResponse,
    summary="Fetch Inbox Messages",
    description="Retrieves messages for the temporary email account using the provided token.",
     responses={
        401: {"model": ErrorDetail, "description": "Unauthorized (Invalid/Expired Token)"},
        500: {"model": ErrorDetail, "description": "Internal Server Error"},
        502: {"model": ErrorDetail, "description": "Bad Gateway (Mail Provider Error)"},
        503: {"model": ErrorDetail, "description": "Service Unavailable (Mail Provider Connection Error)"}
    }
)
def handle_get_messages(authorization: Optional[str] = Header(None)): 
    """Fetches messages using the Bearer token from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        logging.warning("Missing or invalid Authorization header in /messages request.")
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing or invalid (Bearer token required).",
            headers={"WWW-Authenticate": "Bearer"}, 
        )

    token = authorization.split(" ")[1]
    logging.info(f"Received request for /messages with token prefix: {token[:5]}...")

    try:
        messages = fetch_messages_from_provider(token)
        return MessagesResponse(messages=messages)
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception("Unhandled exception in /messages")
        raise HTTPException(status_code=500, detail=f"An unexpected internal error occurred while fetching messages: {e}")

if __name__ == "__main__":
    import uvicorn
    logging.info("Starting Uvicorn server directly (use 'uvicorn server:app --reload' for development)...")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, log_level="info", reload=True)