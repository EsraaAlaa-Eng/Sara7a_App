import CryptoJS from "crypto-js";

export const generateEncryption = async ({ plaintext = "", secretKey = process.env.SECRET_KEY, } = {}) => {
  return CryptoJS.AES.encrypt(plaintext, secretKey).toString()
}

export const decryptEncryption = async ({ cipherText = "", secretKey = process.env.SECRET_KEY, }) => {
  return CryptoJS.AES.decrypt(cipherText, secretKey).toString(CryptoJS.AES.utf8)
}