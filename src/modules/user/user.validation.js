import joi from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'
import { genderEnum } from '../../DB/models/User.model.js'

export const shareProfile = {
    params: joi.object().keys({
        userId: generalFields.Id.required()
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


export const freezeAccount = {
    body: joi.object().keys({
       userId:generalFields.Id,
    }).required()
}
