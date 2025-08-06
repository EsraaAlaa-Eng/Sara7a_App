import { Router } from "express";
import * as userService from "./user.service.js";
import { auth, authentication} from '../../middleware/authentication.middleware.js'
import { tokenTypeEnum } from "../../utils/security/token.security.js";
// import { Route } from "express";
// import { roleEnum } from "../../DB/models/User.model.js";
import { endPoint } from "./user.authorization.js";
const userRouter = Router();

userRouter.get("/", auth({accessRoles:endPoint.Profile}), userService.Profile);
userRouter.get("/refresh-token", authentication({ tokenType: tokenTypeEnum.refresh }), userService.getNewLoginCredentials);



export default userRouter;
