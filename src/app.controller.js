import * as  dotenv from 'dotenv';
import express from 'express';
import connectDB from "./DB/connection.db.js";
import authController from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import { globalErrorHandling } from "./utils/response.js";
dotenv.config();
import cors from 'cors';    //signup with gmail  allow access from any where
import { sendEmail } from './utils/Email/send.email.js';


const bootStrap = async () => {
    const app = express()
    const port = 3000;





    //
    app.use(cors())
    // DB
    await connectDB()

    // convert buffer data
    app.use(express.json())
    // app-routing
    app.get('/', (req, res, next) => res.send('Hello world'))
    app.use("/auth", authController)
    app.use("/user", userRouter)

    app.all('{/*dummy}', (req, res, next) => res.status(404).json({ message: "in-valid page" }))



    // error handling from response file
    app.use(globalErrorHandling);

    await sendEmail({ to: "esoAlaa111@gmail.com", text: "lllll", })




    return app.listen(port, () => console.log(`app run on port ::: ${port}`));


}
export default bootStrap
