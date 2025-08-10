import { asyncHandler } from "../utils/response.js"

export const validation = (scheme) => {
    return asyncHandler(
        async (req, res, next) => {


            const validationResult = scheme.validate(req.body, { abortEarly: false })
            if (validationResult.error) {
                return res.status(400).json({ error_message: "validation error", validationResult })

            }
            return next()
        }
    )

}