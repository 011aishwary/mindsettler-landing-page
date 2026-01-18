export const getEmailTemplate = (status: string, userName: string , date: string, mode: string, time: string) => {
    // Common styles to keep emails looking consistent


    // Define your 3 Templates here
    switch (status.toLowerCase()) {

        // TEMPLATE 1: PENDING
        case 'schedule':
            return {
                subject: "Your MindSettler Session is Confirmed",

                html: `
          <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Session Confirmed – MindSettler</title>
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

        <p>Dear <strong>${userName}</strong>,</p>

        <p>
            We’re happy to inform you that your session with MindSettler has been successfully confirmed.
        </p>

        <!-- Details Box -->
        <div style="background-color:#f0f4f8; border-left:4px solid #769fcd; padding:20px; margin:20px 0;">

            <h3 style="margin-top:0; color:#769fcd; font-size:18px;">Session Details:</h3>

            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:8px;"><strong>Date:</strong> ${date}</li>
                <li style="margin-bottom:8px;"><strong>Time:</strong> ${time}</li>
                <li style="margin-bottom:8px;"><strong>Mode:</strong> ${mode}</li>
                <li style="margin-bottom:8px;"><strong>Therapist:</strong> Parnika Bajaj</li>
            </ul>

        </div>

        <p>
            Please make sure you’re available a few minutes before the scheduled time so the session can begin smoothly.
            If this is an online session, the meeting link will be shared shortly before your appointment.
        </p>

        <p>
            Your well-being matters to us, and we’re glad to be a part of your journey toward clarity and growth.
        </p>

        <p>
            If you need to reschedule or have any questions, feel free to reply to this email.
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
        `
            };

        // TEMPLATE 2: SCHEDULED (Success)
        case 'cancel':
            return {
                subject: "Important: Cancellation & Rescheduling your MindSettler Session",

                html: `
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

        <p>Dear <strong>${userName}</strong>,</p>

        <p>
            We are reaching out to inform you that, due to an unexpected conflict, we have had to cancel your session
            scheduled for <strong>${date}</strong> at <strong>${time}</strong>. Please accept our sincerest apologies for this change.
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

        `
            };

        // TEMPLATE 3: CANCELLED (Rejected)
        case 'create':
            return {
                subject: "We’ve received your request | MindSettler",
                html: `
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

        <p>Dear <strong>${userName}</strong>,</p>

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
                <li style="margin-bottom:8px;"><strong>Preferred Date:</strong> ${date}</li>
                <li style="margin-bottom:8px;"><strong>Preferred Time:</strong> ${time}</li>
                <li style="margin-bottom:8px;"><strong>Mode:</strong> ${mode}</li>
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
        `
            };

        // Fallback for unknown status
        default:
            return {
                subject: 'Notification from MindSettler',
                html: `<div><p>Hello ${userName}, you have a new notification.</p></div>`
            };
    }
};