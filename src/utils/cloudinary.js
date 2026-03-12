const { v2 } = require("cloudinary");

const cloudinary = v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// UPLOAD BASE64 FROM FRONTEND;
const uploadFileOnCloudinary = async (data, folderName = "general") => {
  try {
    if (!data) return null;

    const response = await cloudinary.uploader.upload(data, {
      resource_type: "auto",
      folder: folderName,
    });

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

module.export = { uploadFileOnCloudinary };
