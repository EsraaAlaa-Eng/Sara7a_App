import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // const uri = "mongodb+srv://Esraa:Esraa123@cluster0.97dofjz.mongodb.net/sarahaApp"
        const uri ="mongodb+srv://Esraa:Esraa123@cluster0.aar0uuc.mongodb.net/sarahaApp"

        const result = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000
        })
        console.log(result.models);
        console.log("DB connection Successfully 💕");

    } catch (error) {
        console.log("fail connect on DB", error);
    }
}
export default connectDB