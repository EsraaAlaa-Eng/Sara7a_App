import mongoose from "mongoose";

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




    provider: { type: String, enum: Object.values(providerEnum), default: providerEnum.system },
    confirmEmail: Date,
    confirmEmailOtp: String,


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


    picture: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    restoreAt: Date,
    restoreBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

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

// safety! cheka 
export const userModel = mongoose.models.User || mongoose.model("User", userSchema)
// synchronize any index change or amendment
userModel.syncIndexes()
