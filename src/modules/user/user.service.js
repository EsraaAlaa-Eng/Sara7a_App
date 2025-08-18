import { generateEncryption, decryptEncryption } from "../../utils/security/encryption.security.js"
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as DBService from '../../DB/db.service.js'
import { roleEnum, userModel } from "../../DB/models/User.model.js";
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { logoutEnum } from "../../utils/security/token.security.js";
import { cloud, deleteFolderByPrefix, deleteResources, destroyFile, uploadFile, uploadFiles } from "../../utils/multer/cloudinary.js";
// import { confirmEmail } from "../auth/auth.service.js";
// import { confirmEmail } from "../auth/auth.validation.js";




export const logOut = asyncHandler(
  async (req, res, next) => {
    const { flag } = req.body;
    let status = 200
    switch (flag) {
      case logoutEnum.signoutFromAll:
        await DBService.updateOne({
          model: userModel,
          filter: { _id: req.decoded._id },
          data: {
            changeCredentialsTime: new Date()
          }
        })
        break;

      default:
        await createRevokeToken({ req })
        status = 201
        break;
    }
    return successResponse({ res, status, data: {} });
  }
);




export const Profile = asyncHandler(
  async (req, res, next) => {
    const user = await DBService.findById({
      model: userModel,
      id: req.user._id,
      populate: [{ path: "message" }]
    })

    user.phone = await decryptEncryption({ cipherText: user.phone });

    return successResponse({ res, data: { user } });
  }
);





export const updateBasicInfo = asyncHandler(
  async (req, res, next) => {


    if (req.body.phone) {   //old and new and encryption
      req.body.phone = await generateEncryption({ plaintext: req.body.phone })
    }

    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: {
        _id: req.user._id, //the login user
        // confirmEmail: { $exists: true }
      },
      data: req.body
    })


    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  })






export const updatePassword = asyncHandler(
  async (req, res, next) => {

    const { oldPassword, password, flag } = req.body;
    if (!await compareHash({ plaintext: oldPassword, hashValue: req.user.password })) {
      return next(new Error("In-valid old password"))

    }
    if (req.user.oldPassword?.length) {
      for (const hashPassword of req.user.oldPassword) {
        if (await compareHash({ plaintext: password, hashValue: req.user.hashPassword })) {
          return next(new Error("this password is use before"))

        }
      }
    }


    let updatedData = {}
    switch (flag) {
      case logoutEnum.signoutFromAll:
        updatedData.changeCredentialsTime = new Date()
        break;

      case logoutEnum.signout:
        await createRevokeToken({ req })

        break;
      default:
        break;
    }

    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: {
        _id: req.user._id,

      },
      data: {
        password: await generateHash({ plaintext: password }),
        ...updatedData,
        $push: { oldPassword: req.user.password }

      }
    })


    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  })





export const profileImage = asyncHandler(
  async (req, res, next) => {

    if (!req.file) {
      return next(new Error("Image file is required", { cause: 400 }));
    }

    const { secure_url, public_id } = await uploadFile({ file: req.file, path: `user/${req.user._id}/profile` })
    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: { _id: req.user._id },
      data: {
        picture: { secure_url, public_id }
      },
      option: {
        new: true
      }
    })

    if (user?.picture?.public_id) {
      await destroyFile({ public_id: user.picture.public_id })
    }



    return successResponse({ res, data: { user } })
  })


export const profileCoverImage = asyncHandler(
  async (req, res, next) => {

    // console.log(req.files);


    if (!req.files?.length) {
      return next(new Error("At least one cover image is required", { cause: 400 }));
    }

    const attachments = await uploadFiles({ files: req.files, path: `user/${req.user._id}/cover` })
    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: { _id: req.user._id },
      data: {
        coverImage: attachments
      },
      option: {
        new: true
      }
    })

    if (user?.coverImage?.length) {
      await deleteResources({
        public_id: user.coverImage.map(ele => ele.public_id)
      })
    }

    // if (user?.picture?.public_id) {
    //   await destroyFile({ public_id: user.picture.public_id })
    // }


    return successResponse({ res, data: { user } })
  })






export const freezeAccount = asyncHandler(
  async (req, res, next) => {


    const { userId } = req.params;

    if (userId && req.user.role !== roleEnum.admin) {
      return next(new Error("Not authorize To delete", { cause: 403 }))
    }
    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: {
        _id: userId || req.user._id,  //the login user
        deletedAt: { $exists: false },


      },
      data: {
        deletedAt: Date.now(),
        deletedBy: req.user._id,   //the login user
        $unset: {
          restoreAt: 1,
          restoreBy: 1,
        },
      }

    })


    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  })








export const restoreAccount = asyncHandler(
  async (req, res, next) => {

    const { userId } = req.params;

    const user = await DBService.findOneAndUpdate({
      model: userModel,
      filter: {
        _id: userId,
        deletedAt: { $exists: true },
        deletedBy: { $ne: userId } //not equal 

      },
      data: {
        $unset: {
          deletedAt: 1,
          deletedBy: 1,
        },



        restoreAt: Date.now(),
        restoreBy: req.user._id,   //the login user
      },
    })


    return user ? successResponse({ res, data: { user } })
      : next(new Error("In-valid account ", { cause: 404 }))
  })




export const deleteAccount = asyncHandler(
  async (req, res, next) => {


    const { userId } = req.params;

    const user = await DBService.deleteOne({
      model: userModel,
      filter: {
        _id: userId,
        deletedAt: { $exists: true },


      },
    })
    if (user.deleteAccount) {
      await deleteFolderByPrefix({ prefix: `user/${req.user._id}` })
    }
    return user.deletedCount ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  })






export const shareProfile = asyncHandler(
  async (req, res, next) => {
    const { userId } = req.params;
    const user = await DBService.findOne({
      model: userModel,
      filter: {
        _id: userId,
        confirmEmail: { $exists: true }
      }
    })
    return user ? successResponse({ res, data: { user } }) : next(new Error("In-valid account ", { cause: 404 }))
  }
);




export const getNewLoginCredentials = asyncHandler(
  async (req, res, next) => {
    const user = req.user;
    return successResponse({ res, data: { user: req.user } });
  }
);
