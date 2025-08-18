// import joi from "joi";
import mongoose from "mongoose";
import { localFileUpload } from "../../utils/multer/local.multer.js";

export const genderEnum = { male: "male", female: "female" };
export const roleEnum = { user: "user", admin: "admin" };
export const providerEnum = { system: "system", google: "google" }

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: [20, "FirstNam max length is 20 char and you have entered {VALUE}"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: [20, "FirstNam max length is 20 char and you have entered {VALUE}"]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system ? true : false
        },
    },

    phone: {
        type: String,
        required: function () {
            return this.provider === providerEnum.system ? true : false
        }
    },
    gender: {
        type: String,
        enum: { values: Object.values(genderEnum), message: `gender only allow ${Object.values(genderEnum)}` },
        default: genderEnum.male
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },



    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    restoreAt: Date,
    restoreBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    provider: { type: String, enum: Object.values(providerEnum), default: providerEnum.system },
    confirmEmail: Date,
    confirmEmailOtp: String,
    oldPassword: [String],
    forgotPasswordOtp: [String],
    picture: { secure_url: String, public_id: String },
    coverImage: [{ secure_url: String, public_id: String }],
    changeCredentialsTime: Date,


    ////////////////////////////////////
    failedConfirmEmailAttempts: {
        type: Number,
        default: 0
    },
    confirmEmailBanUntil: {
        type: Date,
        default: null
    },
    ////////////////////////////////////





}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
})
userSchema.virtual("fullName")
    .set(function (value) {
        const [firstName, lastName] = value?.split(" ") || [];
        this.set({ firstName, lastName })
    })
    .get(function () {
        return this.firstName + " " + this.lastName;
    })

userSchema.virtual("message", {
    localField: "_id",
    foreignField: "receiverId",
    ref: "Message"

})
// safety! cheka 
export const userModel = mongoose.models.User || mongoose.model("User", userSchema)
// synchronize any index change or amendment
userModel.syncIndexes()
