import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from '../../../../lib/emailTemplate'; 

export async function POST(request) {
  try {
    const { email, name, date , mode , time ,status } = await request.json();

    if (!email || !name || !status || !date || !mode || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const { subject, html } = getEmailTemplate(status, name , date , mode , time );

    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP provider
      auth: {
        user: process.env.MINDSETTLER_EMAIL,
        pass: process.env.MINDSETTLER_PASS, 
      },
    });

    //  Send the Email
    await transporter.sendMail({
      from: `"MindSettler Team" <${process.env.MINDSETTLER_EMAIL}>`,
      to: email,
      subject: subject,
      html: html,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}