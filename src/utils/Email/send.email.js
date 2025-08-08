import nodemailer from "nodemailer";
export async function sendEmail({
    from = process.env.APP_EMAIL,
    to = "",
    cc = "", //mention
    bcc = "", //blind
    subject = "E_A",
    text = "", // plain‑text body
    html = "",
    attachments = []


} = {}) {


    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });


    // const info = await transporter.sendMail({
    //     from: `"saraha App ⭐" "${process.env.APP_GMAIL}`,
    //     to: ["esoalaa111@gmail.com", "esraaala003@gmail.com"],
    //     cc: "", //mention
    //     bcc: "", //blind
    //     subject: "Hello😊 ✔",
    //     text: "Hello world?", // plain‑text body
    //     html: "<b>Hello world?</b>", // HTML body
    // });

    const info = await transporter.sendMail({
        from: `"saraha App ⭐" "${from}`,
        to, cc, bcc, text, html, subject, attachments
    })

    console.log( "Send mail Successful🍀 ",info.messageId);


}