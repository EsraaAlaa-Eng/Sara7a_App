import joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'
import { genderEnum } from '../../DB/models/User.model.js'
import { logoutEnum } from '../../utils/security/token.security.js'
import { fileValidation } from '../../utils/multer/local.multer.js'

export const shareProfile = {
    params: joi.object().keys({
        userId: generalFields.Id.required()
    })
}


export const logOut = {
    body: joi.object().keys({
        flag: joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayLoggedIn).required()
    })
}



export const updateBasicInfo = {
    body: joi.object().keys({
        fullName: generalFields.fullName,
        phone: generalFields.phone,
        password: generalFields.password,
        gender: generalFields.gender,
    }).required()
}


export const profileImage = {
    file: joi.object().keys({
        filename: generalFields.file.filename.required(),
        fieldname: joi.string().valid('image').required(),
        originalname: generalFields.file.originalname.required(),
        encoding: generalFields.file.encoding.required(),
        mimetype: generalFields.file.mimetype.valid(...fileValidation.image).required(),
        // finalPath: generalFields.file.finalPath.required(),
        destination: generalFields.file.destination.required(),
        path: generalFields.file.path.required(),
        size: generalFields.file.size.required(),
    }).required()


}






export const profileCoverImage = {
    files: joi.array().items(
        joi.object().keys({
            filename: generalFields.file.filename.valid('images').required(),
            fieldname: joi.string().valid('image').required(),
            originalname: generalFields.file.originalname.required(),
            encoding: generalFields.file.encoding.required(),
            mimetype: generalFields.file.mimetype.valid(...fileValidation.image).required(),
            // finalPath: generalFields.file.finalPath.required(),
            destination: generalFields.file.destination.required(),
            path: generalFields.file.path.required(),
            size: generalFields.file.size.required(),
        }).required()


    ).min(1).max(2).required()
}










export const updatePassword = {
    body: logOut.body.append({
        oldPassword: generalFields.password.required(),
        password: generalFields.password.not(joi.ref("oldPassword")).required(),
        confirmPassword: generalFields.confirmPassword.required(),

    })
}


export const freezeAccount = {
    body: joi.object().keys({
        userId: generalFields.Id,
    }),
}

export const restoreAccount = {
    body: joi.object().keys({
        userId: generalFields.Id.required(),
    })
}


export const deleteAccount = {
    body: joi.object().keys({
        userId: generalFields.Id.required(),
    })
}
