import bcrypt from "bcryptjs";

export const generateHash = async ({ plaintext = "", salt = process.env.SALT } = {}) => {
    return  bcrypt.hashSync(plaintext, parseInt(salt));
};

export const compareHash= async ({ plaintext = "", hashValue="" } = {}) => {
    return  bcrypt.compareSync(plaintext, hashValue);
};
