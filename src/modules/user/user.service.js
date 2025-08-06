import { generateEncryption } from "../../utils/security/encryption.security.js"
import { asyncHandler, successResponse } from "../../utils/response.js";


export const Profile = asyncHandler(
  async (req, res, next) => {
    req.user.phone = await generateEncryption({ cipherText: req.user.phone });
    return successResponse({ res, data: { user: req.user } });
  }
);


export const getNewLoginCredentials = asyncHandler(
  async (req, res, next) => {
    const user = req.user;
    return successResponse({ res, data: { user: req.user } });
  }
);
