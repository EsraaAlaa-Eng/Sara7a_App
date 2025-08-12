import jwt from "jsonwebtoken";
import * as DBService from '../../DB/db.service.js'
import { userModel } from "../../DB/models/User.model.js";
import { roleEnum } from "../../DB/models/User.model.js";

export const signatureLevelEnum = { bearer: "Bearer", system: "System" }
export const tokenTypeEnum = { access: "Access", refresh: "Refresh" }


export const generateToken = async ({
  payload = {},
  signature = process.env.SECRET_KEY,
  option = { expiresIn: 12000 }
} = {}) => {
  return jwt.sign(payload, signature, option);
};



export const verifyToken = async ({
  token = "",
  signature = process.env.SECRET_KEY,
} = {}) => {
  console.log({ token, signature });

  return jwt.verify(token, signature);
};




export const getSignatures = async ({ signatureLevel = "Bearer" } = {}) => {

  let signatures = { accessSignature: undefined, refreshSignature: undefined }

  switch (signatureLevel) {
    case signatureLevelEnum.system:
      signatures.accessSignature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE
      signatures.refreshSignature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE
      break;

    default:
      signatures.accessSignature = process.env.ACCESS_USER_TOKEN_SIGNATURE
      signatures.refreshSignature = process.env.REFRESH_USER_TOKEN_SIGNATURE
      break;
  }
  return signatures
}






export const decodedToken = async ({ next, authorization = "", tokenType = tokenTypeEnum.access }) => {
  //       const { authorization } = req.headers;  //destruct key named is authorization

  // console.log(authorization);
  // console.log(authorization?.split(' '));

 
  const [bearer, token] = authorization?.split(' ') || [];


  if (!bearer || !token) {
    return next(new Error('missing token parts', { cause: 401 }));
  }
  let signatures = await getSignatures({ signatureLevel: bearer })

  console.log({ signatures });

  const decoded = await verifyToken({
    token,
    signature: tokenType === tokenTypeEnum.access ? signatures.accessSignature : signatures.refreshSignature
  })
  console.log(decoded);

  //search to user in DB
  const user = await DBService.findById({
    model: userModel,
    id: decoded._id
  });


  if (!user) {
    return next(new Error("Not register account", { cause: 404 }))
  }

  return user

}





export const generateLoginCredentials = async ({ user } = {}) => {
  let signatures = await getSignatures({
    signatureLevel: user.role !== roleEnum.user ? signatureLevelEnum.system : signatureLevelEnum.bearer
  })
  console.log({ signaturesss: signatures });


  const accessToken = await generateToken({
    payload: { _id: user._id },
    signature: signatures.accessSignature,

  })

  // refresh Token
  const refreshToken = await generateToken({
    payload: { _id: user._id },
    signature: signatures.refreshSignature,
    option: {
      expiresIn: Number(process.env.TOKEN_EXPIRATION || 1200)
    }
  })
  return { accessToken, refreshToken }
}