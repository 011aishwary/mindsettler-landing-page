import smtplib
from email.message import EmailMessage
import ssl
import time
import random
import os
from dotenv import load_dotenv
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

EMAIL_TEMPLATE = """Dear {name},

We’re happy to inform you that your session with MindSettler has been successfully confirmed.

Session Details:
Date: {date}
Time: {time}
Mode: {mode} (Online / Offline)
Therapist: Parnika Bajaj

Please make sure you’re available a few minutes before the scheduled time so the session can begin smoothly. If this is an online session, the meeting link will be shared shortly before your appointment.

Your well-being matters to us, and we’re glad to be a part of your journey toward clarity and growth.

If you need to reschedule or have any questions, feel free to reply to this email.

Warm regards,
Team MindSettler
MindSettler – Where Healing Begins
"""

# ============ HELPER ============

def create_email(to_email, name, date, time, mode):
    msg = EmailMessage()
    msg["Subject"] = SUBJECT
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg.set_content(
        EMAIL_TEMPLATE.format(
            name=name,
            date=date,
            time=time,
            mode=mode
        )
    )
    return msg


def main():
    print("=== MindSettler Email Sender (Manual Input Mode) ===")
    # print("Type 'exit' as email to stop.\n")

    if not TEST_MODE:
        context = ssl.create_default_context()
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
    else:
        server = None

    count = 0

    try:
        email = input("Recipient Email: ").strip()
            
        name = input("Name: ").strip()
        date = input("date: ").strip()
        time = input("time: ").strip()
        mode = input("mode: ").strip()

        msg = create_email(email, name, date, time, mode)

        print(f"\nSending to {email}...")

        if TEST_MODE:
            print("   TEST MODE — not sent\n")
        else:
            server.send_message(msg)
            print(f"   ✅ Sent email to {name} <{email}>")

            # delay = random.uniform(5, 20)
            # print(f"   Sleeping for {delay:.1f} seconds...\n")
            # time.sleep(delay)

        count += 1
        print("-" * 40)

    finally:
        if server:
            server.quit()

    print(f"\n✅ DONE: {count} emails processed")


if __name__ == "__main__":
    main()
