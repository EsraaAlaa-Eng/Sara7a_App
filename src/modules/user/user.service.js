import { generateEncryption, decryptEncryption } from "../../utils/security/encryption.security.js"
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from '../../DB/db.service.js'
import { userModel } from "../../DB/models/User.model.js";
// import { confirmEmail } from "../auth/auth.validation.js";

export const Profile = asyncHandler(
  async (req, res, next) => {
    const user = req.user;

    user.phone = await decryptEncryption({ cipherText: user.phone });

    return successResponse({ res, data: { user } });
  }
);



export const updateBasicInfo = asyncHandler(
  async (req, res, next) => {


    if (req.body.phone) {   //old and new and encryption
      req.body.phone = await generateEncryption({ plaintext: req.body.phone })
    }

    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: {
        _id: req.user._id, //the login user
        // confirmEmail: { $exists: true }
      },
      data: req.body
    })


    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  })





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
