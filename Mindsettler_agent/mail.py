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

SUBJECT1 = "Your MindSettler Session is Confirmed"
SUBJECT2 = "Important: Cancellation & Rescheduling your MindSettler Session"
SUBJECT3 = "We’ve received your request | MindSettler"
TEST_MODE = False  # Set False to actually send

# ============ EMAIL TEMPLATE ============

<<<<<<< HEAD
EMAIL_TEMPLATE_HTML = """
<html>
<body>
<p>Dear {name},</p>
=======
EMAIL_TEMPLATE1 = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Appointment Request Received</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7f6; font-family:Arial, Helvetica, sans-serif; color:#333333;">
>>>>>>> 4e2db466e4894fa11c79fe531bd4678061305213

<div style="max-width:600px; margin:20px auto; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">

    <!-- Header -->
    <div style="background-color:#6e5a8e; color:#ffffff; padding:10px; text-align:center;">
        <img src="https://drive.google.com/uc?export=view&id=1l-745e4-UxaZyHG2eza6oMt00tjNBygG"
             alt="MindSettler Logo"
             style="max-width:200px; display:block; margin:0 auto 0px auto;">
    </div>

    <!-- Content -->
    <div style="padding:30px; line-height:1.6;">

        <p>Dear <strong>{name}</strong>,</p>

        <p>Thank you for reaching out to us. We have successfully received your request for an appointment.</p>

        <p>Taking this step is a vital part of your journey toward clarity and growth. Our team is currently reviewing the therapist's availability to finalize your slot.</p>

        <!-- Details box -->
        <div style="background-color:#f0f4f8; border-left:4px solid #769fcd; padding:20px; margin:20px 0;">

            <h3 style="margin-top:0; color:#769fcd; font-size:18px;">Requested Details:</h3>

            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:8px;"><strong>Date:</strong> {date}</li>
                <li style="margin-bottom:8px;"><strong>Time:</strong> {time}</li>
                <li style="margin-bottom:8px;"><strong>Mode:</strong> {mode}</li>
            </ul>
        </div>

        <!-- Next steps -->
        <div style="background-color:#fff9e6; padding:15px; border-radius:5px; margin-top:20px;">

            <p style="margin:0;">
                <strong>What happens next?</strong><br>
                One of our team members will reach out to you within 24 hours to officially confirm your appointment.
                Once confirmed, you will receive a final confirmation email with all necessary links and instructions.
            </p>

        </div>

        <p>If you have any urgent questions, feel free to reply to this email.</p>

        <p>
            Warm regards,<br>
            <strong>Team MindSettler</strong>
        </p>

    </div>

    <!-- Footer -->
    <div style="background-color:#f9f9f9; padding:20px; text-align:center; font-size:12px; color:#777777; border-top:1px solid #eeeeee;">

        <p style="margin:5px 0; font-style:italic; color:#769fcd; font-weight:bold;">
            MindSettler – Where Healing Begins
        </p>

        <p style="margin:5px 0;">&copy; 2026 MindSettler. All rights reserved.</p>

        <p style="margin:5px 0;">If you are in an immediate crisis, please contact your local emergency services.</p>

    </div>

</div>

</body>
</html>

"""
EMAIL_TEMPLATE2 = """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Session Update – MindSettler</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7f6; font-family:Arial, Helvetica, sans-serif; color:#333333;">

<div style="max-width:600px; margin:20px auto; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">

    <!-- Header -->
    <div style="background-color:#6e5a8e; color:#ffffff; padding:10px; text-align:center;">
        <img src="https://drive.google.com/uc?export=view&id=1l-745e4-UxaZyHG2eza6oMt00tjNBygG"
             alt="MindSettler Logo"
             style="max-width:200px; display:block; margin:0 auto 0px auto;">
    </div>

    <!-- Content -->
    <div style="padding:30px; line-height:1.6;">

        <p>Dear <strong>{name}</strong>,</p>

        <p>
            We are reaching out to inform you that, due to an unexpected conflict, we have had to cancel your session
            scheduled for <strong>{date}</strong> at <strong>{time}</strong>. Please accept our sincerest apologies for this change.
        </p>

        <p>
            Your well-being is our priority, and we want to ensure you get your session back on track as soon as possible.
        </p>

        <!-- Action Box -->
        <div style="background-color:#f0f4f8; border-left:4px solid #769fcd; padding:20px; margin:20px 0; text-align:center;">

            <p style="margin:0 0 15px 0; font-size:16px;">
                To reschedule at your convenience, please click the button below to choose a new time that works for you:
            </p>

            <a href="https://www.instagram.com/_p.bajaj_/?hl=en"
               style="display:inline-block; padding:12px 20px; background-color:#769fcd; color:#ffffff; text-decoration:none; border-radius:4px; font-weight:bold;">
                Reschedule Your Appointment
            </a>

        </div>

        <p>
            Once you select a new slot, you will receive a new confirmation email with the updated details.
            If you have any trouble using the link or prefer to speak with us, simply reply to this email.
        </p>

        <p>
            We appreciate your understanding and look forward to seeing you soon.
        </p>

        <p>
            Warm regards,<br>
            <strong>Team MindSettler</strong>
        </p>

    </div>

    <!-- Footer -->
    <div style="background-color:#f9f9f9; padding:20px; text-align:center; font-size:12px; color:#777777; border-top:1px solid #eeeeee;">

        <p style="margin:5px 0; font-style:italic; color:#769fcd; font-weight:bold;">
            MindSettler – Where Healing Begins
        </p>

        <p style="margin:5px 0;">&copy; 2026 MindSettler. All rights reserved.</p>

        <p style="margin:5px 0;">If you are in an immediate crisis, please contact your local emergency services.</p>

    </div>

</div>

</body>
</html>

"""

EMAIL_TEMPLATE3 = """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Appointment Request Received – MindSettler</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7f6; font-family:Arial, Helvetica, sans-serif; color:#333333;">

<div style="max-width:600px; margin:20px auto; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">

    <!-- Header -->
    <div style="background-color:#6e5a8e; color:#ffffff; padding:10px; text-align:center;">
        <img src="https://drive.google.com/uc?export=view&id=1l-745e4-UxaZyHG2eza6oMt00tjNBygG"
             alt="MindSettler Logo"
             style="max-width:200px; display:block; margin:0 auto 0px auto;">
    </div>

    <!-- Content -->
    <div style="padding:30px; line-height:1.6;">

        <p>Dear <strong>{name}</strong>,</p>

        <p>
            Thank you for reaching out to MindSettler. We have successfully received your application for an appointment.
        </p>

        <p>
            We understand that taking this step is an important part of your journey, and we want to ensure everything is set up perfectly for you.
            Our team is currently reviewing the availability of our therapists to finalize your slot.
        </p>

        <!-- Details Box -->
        <div style="background-color:#f0f4f8; border-left:4px solid #769fcd; padding:20px; margin:20px 0;">

            <h3 style="margin-top:0; color:#769fcd; font-size:18px;">Your Requested Details:</h3>

            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:8px;"><strong>Preferred Date:</strong> {date}</li>
                <li style="margin-bottom:8px;"><strong>Preferred Time:</strong> {time}</li>
                <li style="margin-bottom:8px;"><strong>Mode:</strong> {mode}</li>
            </ul>

        </div>

        <!-- Next Steps -->
        <div style="background-color:#fff9e6; padding:15px; border-radius:5px; margin-top:20px;">
            <p style="margin:0;">
                <strong>What happens next?</strong><br>
                One of our team members will reach out to you within <strong>24 hours</strong> to officially confirm your appointment.
                Once confirmed, you will receive a final confirmation email with all the necessary details and the meeting link (if applicable).
            </p>
        </div>

        <p>
            If you have any urgent questions in the meantime, please feel free to reply to this email.
        </p>

        <p>
            We look forward to supporting you soon.
        </p>

        <p>
            Warm regards,<br>
            <strong>Team MindSettler</strong>
        </p>

    </div>

    <!-- Footer -->
    <div style="background-color:#f9f9f9; padding:20px; text-align:center; font-size:12px; color:#777777; border-top:1px solid #eeeeee;">

        <p style="margin:5px 0; font-style:italic; color:#769fcd; font-weight:bold;">
            MindSettler – Where Healing Begins
        </p>

        <p style="margin:5px 0;">&copy; 2026 MindSettler. All rights reserved.</p>

        <p style="margin:5px 0;">If you are in an immediate crisis, please contact your local emergency services.</p>

    </div>

</div>

</body>
</html>

"""



# ============ HELPER ============

def create_email(to_email, name, date, time, mode, status):
    
    if status == "Scheduled":
        msg = EmailMessage()
        msg["Subject"] = SUBJECT1
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg.set_content(
            EMAIL_TEMPLATE1.format(
                name=name,
                date=date,
                time=time,
                mode=mode
            ),
            subtype = "html"
        )
    elif status == "Cancelled":
        msg = EmailMessage()
        msg["Subject"] = SUBJECT2
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg.set_content(
            EMAIL_TEMPLATE2.format(
                name=name,
                date=date,
                time=time,
                mode=mode
            ),
            subtype = "html"
        )
    elif status == "Waiting":
        msg = EmailMessage()
        msg["Subject"] = SUBJECT3
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg.set_content(
            EMAIL_TEMPLATE3.format(
                name=name,
                date=date,
                time=time,
                mode=mode
            ),
            subtype = "html"
        )
    return msg


def main(email, name, date, timee, mode, status):
    print("=== MindSettler Email Sender ===")

    if not TEST_MODE:
        context = ssl.create_default_context()
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
    else:
        server = None

    count = 0

    try:
        msg = create_email(email, name, date, timee, mode, status)

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
        status = input_data.get("status", "").strip()
        print(email)
        print(f"Preparing email for {name} <{email}> on {date} at {timee} ({mode})")

        main(email, name, date, timee, mode, status)

        print(f"\nSending to {email}...")
        # result = query_chatbot(input_msg)
        # response = {"Reply": result}
        print( json.dumps(input_data) )
    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response)) 
        traceback.print_exc()
        sys.exit(1)
