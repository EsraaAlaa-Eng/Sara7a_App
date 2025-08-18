
import multer from "multer";

export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword']
}

export const cloudFileUpload = ({ Validation = [] }) => {
    // let bas5ePath = `uploads/${customPath}`


    const storage = multer.diskStorage({})

    const fileFilter = function (req, file, callback) {
        // console.log(file);

        if (Validation.includes(file.mimetype)) {
            return callback(null, true)
        }
        return callback("In-valid file format", false)
    }
    return multer({
        // fileFilter,
        storage,
        limits: { fileSize: 2 * 1024 * 1024 } 
    })

}