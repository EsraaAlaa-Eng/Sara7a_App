import { generateEncryption } from "../../utils/security/encryption.security.js"
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from '../../DB/db.service.js'
import { userModel } from "../../DB/models/User.model.js";
import { confirmEmail } from "../auth/auth.validation.js";

export const Profile = asyncHandler(
  async (req, res, next) => {
    req.user.phone = await generateEncryption({ cipherText: req.user.phone });
    return successResponse({ res, data: { user: req.user } });
  }
);


export const shareProfile = asyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;
    const user = await DBService.findOne({
      model: userModel,
      filter: {
        _id: userId,
        confirmEmail: { $exists: true }
      }
    })
    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  }
);

export const getNewLoginCredentials = asyncHandler(
  async (req, res, next) => {
    const user = req.user;
    return successResponse({ res, data: { user: req.user } });
  }
);
