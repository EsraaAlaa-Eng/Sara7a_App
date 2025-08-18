import joi from "joi";
import { asyncHandler } from "../utils/response.js"
import { genderEnum } from "../DB/models/User.model.js";
import mongoose from 'mongoose'



export const generalFields = {

    fullName: joi.string().min(2).max(20).messages({
        "string.min": "min name length is 2 char ",
        "any.require": "fullName is mandatory ",
    }),

    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['net', 'com', 'edu'] } }),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword: joi.string().valid(joi.ref("password")),
    phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    otp: joi.string().pattern(new RegExp(/^\d{6}$/)),
    gender: joi.string().valid(...Object.values(genderEnum)),
    Id: joi.string().custom(
        (value, helper) => {
            // console.log({ helper });
            // console.log(value);
            // console.log(types.object.isValid(value));
            return types.object.isValid(value) || helper.message("In-valid Object id")

        }),
    id: joi.string().custom((value, helper) => {
        return mongoose.Types.ObjectId.isValid(value)
            ? value
            : helper.message("In-valid Object id");
    }),

    file: {
        filename: joi.string(),
        fieldname:joi.string(),
        originalname: joi.string(),
        encoding: joi.string(),
        mimetype: joi.string(),
        finalPath: joi.string(),
        destination: joi.string(),
        path: joi.string(),
        size: joi.number().positive(),

    },

}


export const validation = (scheme) => {
    return asyncHandler(
        async (req, res, next) => {
            // console.log(scheme);
            // console.log(Object.keys(scheme));
            const validationError = []
            for (const key of Object.keys(scheme)) {

                const validationResult = scheme[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationError.push({
                        key, details: validationResult.error.details.map(ele => {
                            return { message: ele.message, path: ele.path[0] }
                        })
                    })
                }




            }
            if (validationError.length) { //length validationError >0 than have problem
                return res.status(400).json({ error_message: "validation error", validationError })
            }

            return next()
        }
    )

}