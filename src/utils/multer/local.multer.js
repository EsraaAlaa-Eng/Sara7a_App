import fs from 'node:fs'
import path from 'node:path'
import multer from "multer";

export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword']
}

export const localFileUpload = ({ Validation = [], maxSizeMB = 2 }) => {
    let basePath = `uploads/${customPath}`


    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            if (!req.user?._id) {
                basePath += `/${req.user._id}`
            }
            const fullPath = path.resolve(`./src/${basePath}`)   //absolutepath
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true })
            }
            callback(null, path.resolve(fullPath))

        },

        filename: function (req, file, callback) {
            // console.log({ file });
            const uniqueFileName = Date.now() + "___" + Math.random() + "___" + file.originalname
            file.finalPath = basePath + "/" + uniqueFileName
            callback(null, uniqueFileName)
        }
     })


    const fileFilter = function (req, file, callback) {

        if (Validation.includes(file.mimetype)) {
            return callback(null, true)
        }
        return callback("In-valid file format ",false)
    }
    return multer({
        dest: "./temp",
        fileFilter,
        storage,
        limits: {
            fileSize: maxSizeMB * 1024 * 1024
        }
    })

}