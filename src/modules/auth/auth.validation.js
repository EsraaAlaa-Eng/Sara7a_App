import joi from "joi";
import { generalFields } from '../../middleware/validation.middleware.js'
import { IdTokenClient } from "google-auth-library";


export const login = {
    body: joi.object().keys({
        email: generalFields.email.required(),
        password: generalFields.password.required(),
    }).required(),
}


export const signup = {
    body: login.body.append({
        fullName: generalFields.fullName.required(),
        phone: generalFields.phone.required(),
        confirmPassword: generalFields.confirmPassword.required(),
    }),

    query: joi.object().keys({
        lang: joi.string().valid("ar", "en").required(),
    }).required(),

}


export const confirmEmail = {
    body: joi.object().keys({
        email: generalFields.email.required(),
        otp: generalFields.otp.required(),

    }),


}



export const loginWithGmail = {
    body: joi.object().keys({
        IdToken: joi.string().required(),

    }),

}




