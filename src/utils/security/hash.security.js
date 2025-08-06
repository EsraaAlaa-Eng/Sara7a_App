import bcrypt from "bcryptjs";

export const hashPassword = async ({ plaintext = "", salt = process.env.SALT } = {}) => {
    return  bcrypt.hashSync(plaintext, parseInt(salt));
};

export const comparePassword = async ({ plaintext = "", hashedPassword="" } = {}) => {
    return  bcrypt.compareSync(plaintext, hashedPassword);
};
