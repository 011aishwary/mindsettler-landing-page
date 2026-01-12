import smtplib
from email.message import EmailMessage
import ssl
import sys
import time
import random
import os
from dotenv import load_dotenv
import json
import traceback
# ============ CONFIGURATION ============
load_dotenv()
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465

SENDER_EMAIL = os.getenv("MINDSETTLER_EMAIL")
SENDER_PASSWORD = os.getenv("MINDSETTLER_PASS")
 # App password

SUBJECT = "Your MindSettler Session is Confirmed"
TEST_MODE = False  # Set False to actually send

# ============ EMAIL TEMPLATE ============

EMAIL_TEMPLATE_HTML = """<html>
<body>
<p>Dear {name},</p>

<p>We’re happy to inform you that your session with MindSettler has been successfully confirmed.</p>

<p><strong>Session Details:</strong><br>
Date: {date}<br>
Time: {time}<br>
Mode: {mode}<br>
Therapist: Parnika Bajaj</p>

<p>Please make sure you’re available a few minutes before the scheduled time so the session can begin smoothly. If this is an online session, the meeting link will be shared shortly before your appointment.</p>

<p>Your well-being matters to us, and we’re glad to be a part of your journey toward clarity and growth.</p>

<p>If you need to reschedule or have any questions, feel free to reply to this email.</p>

<p>Warm regards,<br>
Team MindSettler<br>
MindSettler – Where Healing Begins</p>
</body>
</html>"""



# ============ HELPER ============

def create_email(to_email, name, date, time, mode):
    msg = EmailMessage()
    msg["Subject"] = SUBJECT
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg.set_content(
        EMAIL_TEMPLATE_HTML.format(
            name=name,
            date=date,
            time=time,
            mode=mode
        ),
        subtype='html'
    )
    return msg


def main(email, name, date, timee, mode):
    print("=== MindSettler Email Sender ===")

    if not TEST_MODE:
        context = ssl.create_default_context()
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
    else:
        server = None

    count = 0

    try:
        msg = create_email(email, name, date, timee, mode)

        if TEST_MODE:
            print("   TEST MODE — not sent\n")
        else:
            server.send_message(msg)
            print(f"   ✅ Sent email to {name} <{email}>")

        count += 1
        print("-" * 40)

    finally:
        if server:
            server.quit()

    print(f"\n✅ DONE: {count} emails processed")



if __name__ == "__main__":

    # main()
    try:
        input_msg = sys.argv[1] if len(sys.argv) > 1 else "{}"
        # input_data = {
        #     "email": "doodle1boogle@gmail.com",
        #     "name": "Aishwary G",
        #     "date": "2024-06-30",
        #     "time": "10:00 AM",
        #     "mode": "Online"
        # }
        
        try:
            input_data = json.loads(input_msg)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON input: {str(e)}"}))
            sys.exit(1)
        email = input_data.get("email", "").strip()
        name = input_data.get("name", "").strip()
        date = input_data.get("date", "").strip()
        timee = input_data.get("time", "").strip()
        mode = input_data.get("mode", "").strip()
        print(email)
        print(f"Preparing email for {name} <{email}> on {date} at {timee} ({mode})")

        main(email, name, date, timee, mode)

        print(f"\nSending to {email}...")
        # result = query_chatbot(input_msg)
        # response = {"Reply": result}
        print( json.dumps(input_data) )
    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response)) 
        traceback.print_exc()
        sys.exit(1)
