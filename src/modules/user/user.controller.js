import { Router } from "express";
import * as userService from "./user.service.js";
import { auth, authentication, authorization } from '../../middleware/authentication.middleware.js'
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import { endPoint } from "./user.authorization.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js"
import { fileValidation, localFileUpload } from "../../utils/multer/local.multer.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";

const userRouter = Router(
    {
        caseSensitive: true,
        strict: true,
    });


userRouter.post("/logout", authentication(), userService.logOut);
userRouter.get('/', authentication(), validation(validators.logOut), userService.Profile)
userRouter.get("/:userId", userService.shareProfile);

userRouter.patch("/",
    authentication(),
    validation(validators.updateBasicInfo),
    userService.updateBasicInfo);

userRouter.delete("{/:userId}/freeze-account",    //userid is a option we use it when admin want delete user account
    authentication(),
    validation(validators.freezeAccount),
    userService.freezeAccount
);



userRouter.patch("/:userId/restore-account",
    auth({ accessRoles: endPoint.restoreAccount }),
    validation(validators.restoreAccount),
    userService.restoreAccount);



userRouter.patch("/password",
    authentication(),
    validation(validators.updatePassword),
    userService.updatePassword);

userRouter.patch("/profile-image",
    authentication(),
    cloudFileUpload({ validation: fileValidation.image }).single("image"),
    validation(validators.profileImage),
    userService.profileImage);


userRouter.patch("/profile-cover-image",
    authentication(),
    cloudFileUpload({ validation: fileValidation.image }).array("image", 2),
    // validation(validators.profileCoverImage),
    userService.profileCoverImage);


userRouter.delete("/:userId",
    auth({ accessRoles: endPoint.deleteAccount }),
    validation(validators.deleteAccount),
    userService.deleteAccount
);


// userRouter.delete("/freeze-account",    //userid is a option we use it when admin want delete user account
//     authentication(),
//     validation(validators.freezeAccount),
//     userService.userFreezeAccount
// );




userRouter.get("/refresh-token", authentication({ tokenType: tokenTypeEnum.refresh }), userService.getNewLoginCredentials);



export default userRouter;
