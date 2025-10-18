import nodemailer from "nodemailer";

const emailRouter = require("express").Router();

emailRouter.post("/send-confirmation", async (req, res) => {
  const {
    full_name,
    email,
    title,
    date,
    from_time,
    to_time,
    location,
    tickets,
  } = req.body;

  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create email content
    const mailOptions = {
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmation: ${title}`,
      html: `<html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Booking Confirmation - EventHub</title>
    </head>
    <body
      style="
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f9fafb;
        color: #111827;
        margin: 0;
        padding: 40px 0;
        text-align: center;
      "
    >
      <table
        align="center"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          max-width: 500px;
          margin: auto;
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        "
      >
        <tr>
          <td>
            <h1 style="color: #4f46e5; font-size: 26px; margin-bottom: 12px;">
              Booking Confirmed 🎉
            </h1>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
              Hi <strong>${full_name}</strong>,<br />
              Thank you for booking your spot! Here are your event details:
            </p>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="text-align: left; font-size: 15px; color: #374151;"
            >
              <tr>
                <td style="padding: 6px 0;"><strong>Event:</strong></td>
                <td>${title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Date:</strong></td>
                <td>${date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Time:</strong></td>
                <td>${from_time} – ${to_time}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Location:</strong></td>
                <td>${location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Tickets:</strong></td>
                <td>${tickets}</td>
              </tr>
            </table>

            <a
              href="https://youreventhub.com/my-bookings"
              style="
                display: inline-block;
                background: linear-gradient(135deg, #4f46e5, #6366f1);
                color: #ffffff;
                text-decoration: none;
                font-weight: 600;
                margin-top: 28px;
                padding: 14px 28px;
                border-radius: 8px;
                transition: opacity 0.3s;
              "
            >
              View My Booking
            </a>

            <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">
              Need help? Contact us at
              <a href="mailto:support@youreventhub.com" style="color: #4f46e5; text-decoration: none;">support@youreventhub.com</a>.
            </p>

            <hr
              style="border: none; height: 1px; background-color: #e5e7eb; margin: 32px 0;"
            />

            <p style="font-size: 12px; color: #9ca3af;">
              &copy; ${new Date().getFullYear()} EventHub. All rights reserved.<br />
              <a href="https://youreventhub.com" style="color: #6366f1; text-decoration: none;">Visit our site</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Confirmation email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = emailRouter;
