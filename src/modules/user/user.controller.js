import { Router } from "express";
import * as userService from "./user.service.js";
import { auth, authentication, authorization } from '../../middleware/authentication.middleware.js'
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import { endPoint } from "./user.authorization.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js"

const userRouter = Router();

userRouter.get("/", auth({ accessRoles: endPoint.Profile }), userService.Profile);
userRouter.get("/:userId", userService.shareProfile);
userRouter.patch("/", 
    authentication(), 
    validation(validators.updateBasicInfo), 
    userService.updateBasicInfo);
userRouter.get("/refresh-token", authentication({ tokenType: tokenTypeEnum.refresh }), userService.getNewLoginCredentials);



export default userRouter;
