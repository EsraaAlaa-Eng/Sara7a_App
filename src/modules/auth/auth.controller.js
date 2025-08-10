import { Router } from "express";
import * as authService from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import *as validators from './auth.validation.js'
const router = Router();

router.post("/signup",validation(validators.signup),authService.signup);
router.post("/login", validation(validators.login),authService.login);
router.post('/refresh-token',authService.refreshToken);
router.patch('/confirm-email',authService.confirmEmail);


router.post("/signup/gmail", authService.signupWithGmail);
// router.patch("/updatePassword", authService.updatePassword); 

export default router;
