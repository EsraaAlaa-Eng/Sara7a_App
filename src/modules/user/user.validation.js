import joi, { types } from 'joi'
import { generalFields } from '../../middleware/validation.middleware.js'
export const shareProfile = {
    params: joi.object().keys({
        userId:generalFields.Id.required()
    })}