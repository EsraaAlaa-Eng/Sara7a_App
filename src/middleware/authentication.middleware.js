import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js";
import { asyncHandler } from "../utils/response.js";

export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {
    return asyncHandler(
        async (req, res, next) => {

            // console.log(req.headers.authorization); 
            const { user, decoded } = await decodedToken({ next, authorization: req.headers.authorization, tokenType }) || {};
            req.user = user;
            req.decoded = decoded;
            return next()

        }
    )

}


// authorization

export const authorization = ({ accessRoles = [] } = {}) => {
    //مين الي مسموحله يعدي 
    return asyncHandler(
        async (req, res, next) => {
            // console.log({ accessRoles, currentRole: req.user.role, match: accessRoles.includes(req.user.role) });

            if (!accessRoles.includes(req.user.role)) {
                return next(new Error("Not authorization account"), { cause: 403 })
            }
            return next()

        })

}





// authentication &&  authorization
export const auth = ({ tokenType = tokenTypeEnum.access, accessRoles } = {}) => {
    return asyncHandler(
        async (req, res, next) => { //authentication 1
            const { user, decoded } = await decodedToken({ next, authorization: req.headers.authorization, tokenType }) || {};
            req.user = user;
            req.decoded = decoded;
            // console.log({ accessRoles, currentRole: req.user.role, match: accessRoles.includes(req.user.role) } )


            // authorization 2 
            if (!accessRoles.includes(req.user.role)) {
                return next(new Error("Not authorization account"), { cause: 403 })
            }
            return next()

        })

}
