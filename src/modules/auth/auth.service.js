import { providerEnum, roleEnum, userModel } from "../../DB/models/User.model.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBservice from '../../DB/db.service.js';
import { generateEncryption } from "../../utils/security/encryption.security.js";
import { generateHash, comparePassword } from "../../utils/security/hash.security.js";
import jwt from 'jsonwebtoken';
import { generateLoginCredentials, generateToken, getSignatures, signatureLevelEnum } from "../../utils/security/token.security.js";
import { OAuth2Client } from 'google-auth-library';
import { emailEvent } from "../../utils/event/email.event.js";
import { customAlphabet } from 'nanoid';



export const signup = asyncHandler(async (req, res, next) => {
    const { fullName, email, password, phone } = req.body;
    console.log({ fullName, email, password, phone });

    const existingUser = await DBservice.findOne({
        model: userModel,
        filter: { email }
    });
    if (existingUser) {
        return next(new Error("Email already exists"), { cause: 409 });
    }

    const hashedPassword = await generateHash({ plaintext: password });
    const encryptedPhone = await generateEncryption({ plaintext: phone })
    // Before save user in DB
    const otp = customAlphabet("123456789", 6)()  //alphabet: string, defaultSize?: number
    const confirmEmailOtp = await generateHash({ plaintext: otp })

    const user = await DBservice.create({
        model: userModel,
        data: [{
            fullName,
            email,
            password: hashedPassword,
            phone: encryptedPhone,
            confirmEmailOtp,
        }]
    });
    emailEvent.emit("confirmEmail", { to: email, otp: otp })

    return successResponse({ res, status: 201, data: { user } });
});

export const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    const user = await DBservice.findOne({
        model: userModel,
        filter: { email, provider: providerEnum.system },
    });



    if (!user) return next(new Error("Invalid email or password"), { cause: 404 });
    // console.log(user);

    if (!user.confirmEmail) {
        return next("pleas verify your otp account first")
    }

    if (!await comparePassword({ plaintext: password, hashedPassword: user.password })) {
        return next(new Error("In-valid login Data", { cause: 401 }));

    }

    console.log("llll");

    const credentials = await generateLoginCredentials({ user })



    return successResponse({
        res,
        status: 200,
        data: ({ user, data: { credentials } })
    });
});


async function verifyGoogleAccount({ idToken } = {}) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_IDS.split(","),
    });
    const payload = ticket.getPayload();
    return payload
}



export const signupWithGmail = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body;
        const { picture, name, email, email_verified } = await verifyGoogleAccount({ idToken })
        console.log({ picture, name, email, email_verified });

        if (!email_verified) {
            return next(new Error("not verified account ", { cause: 400 }))
        }

        const user = await DBservice.findOne({
            model: userModel,
            filter: { email }
        })

        if (user) {
            if (user.provider === providerEnum.google) {
                //////////////////////////Q////////////////////////////
                const credentials = await generateLoginCredentials({ user })
                successResponse({ res, status: 200, data: { credentials } })

            }

        }




        const [newUser] = await DBservice.create({

            model: userModel,
            data: [{
                fullName: name,
                email,
                picture,
                confirmEmail: Date.now(),
                provider: providerEnum.google
            }]

        })
        console.log({ newUser });

        // console.log(JSON.stringify(newUser, null, 2));

        const credentials = await generateLoginCredentials({ user: newUser })

        return successResponse({ res, status: 201, data: { credentials } });



    });


///////////////////////////////Q/////////////////////////////////////
// const newUser = new userModel();

// newUser.fullName = name;
// newUser.email = email;
// newUser.picture = picture;
// newUser.confirmEmail = Date.now();
// newUser.provider = providerEnum.google;

// await newUser.save();






export const loginWithGmail = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body;
        const { email, email_verified } = await verifyGoogleAccount({ idToken })

        if (!email_verified) {
            return next(new Error("not verified account ", { cause: 400 }))
        }

        const user = await DBservice.findOne({
            model: userModel,
            filter: { email, provider: providerEnum.google }
        })

        if (!user) {
            return next(new Error("  in-valid login data or in-valid provider", { cause: 404 }))

        }




        const credentials = await getNewLoginCredentials({ user })

        successResponse({ res, status: 200, data: { credentials } })

    }
)

// refreshToken
export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const payload = jwt.verify(authorization, process.env.REFRESH_TOKEN_SIGNATURE)
    const user = await findById(userModel, payload._id)
    if (!user) {
        return next(new Error("User Not Found"), { cause: 404 })
    }

    const accessToken = jwt.sign({
        _id: user._id,
        email: user.email,
        signature: process.env.TOKEN_SIGNATURE,
        options: { expiresIn: `20 s` }
    })
    successResponse({ res, data: { accessToken }, status: 202 })
}