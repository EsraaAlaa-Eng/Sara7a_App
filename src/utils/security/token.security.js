import jwt from "jsonwebtoken";
import * as DBService from '../../DB/db.service.js'
import { userModel } from "../../DB/models/User.model.js";
import { roleEnum } from "../../DB/models/User.model.js";
import { nanoid } from 'nanoid';
import { TokenModel } from "../../DB/models/token.model.js";


export const signatureLevelEnum = { bearer: "Bearer", system: "System" }
export const tokenTypeEnum = { access: "Access", refresh: "Refresh" }
export const logoutEnum = { signoutFromAll: "signoutFromAll", signout: "signout", stayLoggedIn: "stayLoggedIn" }

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
  // console.log({ token, signature });

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
  const signatures = await getSignatures({ signatureLevel: bearer })
  const decoded = await verifyToken({
    token,
    signature: tokenType === tokenTypeEnum.access ? signatures.accessSignature : signatures.refreshSignature
  })
  // console.log(decoded);

  if (decoded.jti && await DBService.findOne({ model: TokenModel, filter: { jti: decoded.jti } })) {
    return next(new Error("In-valid login credentials", { cause: 401 }))

  }

  //search to user in DB
  const user = await DBService.findById({
    model: userModel,
    id: decoded._id
  });


  if (!user) {
    return next(new Error("Not register account", { cause: 404 }))
  }
  if (user.changeCredentialsTime?.getTime() > decoded.iat * 1000) {
    return next(new Error("In-valid login credentials", { cause: 401 }))

  }

  return { user, decoded }

}





export const generateLoginCredentials = async ({ user } = {}) => {
  let signatures = await getSignatures({
    signatureLevel: user.role !== roleEnum.user ? signatureLevelEnum.system : signatureLevelEnum.bearer
  })

  const jwtid = nanoid()

  const accessToken = await generateToken({
    payload: { _id: user._id },
    signature: signatures.accessSignature,
    option: {
      jwtid,
      expiresIn: Number(process.env.TOKEN_EXPIRATION || 1200)
    }

  })

  // refresh Token
  const refreshToken = await generateToken({
    payload: { _id: user._id },
    signature: signatures.refreshSignature,
    option: {
      jwtid,
      expiresIn: Number(process.env.TOKEN_EXPIRATION || 1200)
    }
  })
  return { accessToken, refreshToken }
}




export const createRevokeToken = async ({ req } = {}) => {
  await DBService.create({
    model: TokenModel,
    data: [{
      jti: req.decoded.jti,
      expiresIn: req.decoded.iat + Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
      userId: req.decoded._id,
    }]

  })
  return true
}