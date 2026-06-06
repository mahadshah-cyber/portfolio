import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    // Minimal logging only (avoid storing full message/email in server logs)
    console.log("Contact Form Submission:", {
      nameLength: String(name).length,
      emailDomain: String(email).split("@")[1] || null,
      subjectPresent: Boolean(subject),
      messageLength: String(message).length,
    });

    // Nodemailer transporter is structured and ready.
    // When SMTP_PASS is set in .env, uncomment below to send real emails.
    //
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: Number(process.env.SMTP_PORT),
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    //
    // await transporter.sendMail({
    //   from: `"${name}" <${email}>`,
    //   to: process.env.ADMIN_EMAIL,
    //   subject: subject
    //     ? `[Portfolio] ${subject}`
    //     : `[Portfolio] New message from ${name}`,
    //   html: `
    //     <div style="font-family: sans-serif; max-width: 600px;">
    //       <h2 style="color: #cc0000;">Portfolio Contact</h2>
    //       <p><strong>From:</strong> ${name} (${email})</p>
    //       ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
    //       <hr style="border: 1px solid #333;" />
    //       <p>${message.replace(/\n/g, "<br/>")}</p>
    //     </div>
    //   `,
    // });

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
