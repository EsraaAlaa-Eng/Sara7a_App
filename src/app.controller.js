import path from "node:path";
import * as  dotenv from 'dotenv';
import express from 'express';
import connectDB from "./DB/connection.db.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import messageController from "./modules/message/message.controller.js";
import { asyncHandler, globalErrorHandling } from "./utils/response.js";
import cors from 'cors';    //signup with gmail  allow access from any where
import { sendEmail } from './utils/Email/send.email.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'
import chalk from 'chalk';
import cron from "node-cron";
import { MessageModel } from "./DB/models/Message.model.js";
import { TokenModel } from "./DB/models/token.model.js";


dotenv.config({});

const bootStrap = async () => {
    const app = express()
    const port = process.env.PORT;




    // cronJobs.js
    const startCronJobs = asyncHandler(async () => {
        cron.schedule("0 0 * * 0 ", asyncHandler(async () => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            const result = await MessageModel.deleteMany({
                createdAt: { $lt: weekAgo }
            });

            const tokenResult = await TokenModel.deleteMany({
                createdAt: { $lte: weekAgo },
            });

            console.log(
                `CronJob: ${result.deletedCount} old messages & ${tokenResult.deletedCount} tokens deleted (older than one week)`
            );
        }));
    });

    await startCronJobs();





    //cors  
    // var whitelist = process.env.ORIGINS.split(",")
    // var corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) {
    //             callback(null, true)
    //         } else {
    //             callback(new Error('Not allowed by CORS'))
    //         }
    //     }
    // }
    app.use(cors())
    app.use(morgan('dev'))
    app.use(helmet())


    const limiter = rateLimit({
        windowMs: 60 * 60 * 1000, //1min
        limit: 20000,
        // legacyHeaders:false
        standardHeaders: 'draft-8'

    })
    app.use(limiter)
    // DB
    await connectDB()

    app.use("/uploads", express.static(path.resolve('./src/uploads')))
    // convert buffer data
    app.use(express.json())
    // app-routing
    app.get('/', (req, res, next) => res.send('Hello world'))
    app.use("/auth", authController)
    app.use("/user", userController)
    app.use("/message", messageController)

    app.all('{/*dummy}', (req, res, next) => res.status(404).json({ message: "in-valid page" }))



    // error handling from response file
    app.use(globalErrorHandling);

    await sendEmail({ to: "esoAlaa111@gmail.com", text: "lllll", })




    return app.listen(port, () => console.log(chalk.bgYellow(chalk.black(`app run on port ${port} !`))));


}
export default bootStrap
