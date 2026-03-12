// import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

// /**
//  * MIDDLEWARE TO UPLOAD base64 IMAGE TO CLOUDINARY;
//  * FETCHES base64 FROM req.body.avatar, UPLOADS IT, AND SAVES URL AS req.body.avatarUrl;
//  */
// const processAvatarUrl = async (req, res, next) => {
//   try {
//     const { avatarUrl } = req.body;

//     if (!avatarUrl) {
//       return next();
//     }

//     const cloudinaryResponse = await uploadFileOnCloudinary(avatarUrl);

//     if (!cloudinaryResponse) {
//       return res.status(500).json({ message: "Failed to upload image" });
//     }

//     req.body.avatarUrl = cloudinaryResponse.secure_url;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// const processLogoUrl = async (req, res, next) => {
//   try {
//     const { logoUrl } = req.body;

//     if (!logoUrl) {
//       return next();
//     }

//     const cloudinaryResponse = await uploadFileOnCloudinary(logoUrl);

//     if (!cloudinaryResponse) {
//       return res.status(500).json({ message: "Failed to upload image" });
//     }

//     req.body.logoUrl = cloudinaryResponse.secure_url;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// module.export = { processAvatarUrl, processLogoUrl };
