import { EventEmitter } from 'node:events';
import { sendEmail } from '../Email/send.email.js'
import {verifyEmailTemplate} from '../Email/templates/verify.email.template.js'
export const emailEvent = new EventEmitter()

emailEvent.on("confirmEmail", async (data) => {
    await sendEmail({
        to: data.to, subject: data.subject || "confirm-Email", html: verifyEmailTemplate( data.otp ) ////Q:- {otp:data>otp} >>object object
        
    }).catch(error => {
        console.log(`fail to send email to ${data.to}`);

    })
})
