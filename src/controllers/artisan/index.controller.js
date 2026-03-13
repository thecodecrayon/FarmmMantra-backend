const { Artisans } = require("../../models/index.js");
const { asyncHandler, formatToJSON } = require("../../utils/index.js");
const { uploadFileOnCloudinary } = require("../../utils/cloudinary.js");

const createArtisan = asyncHandler(async (req, res) => {
  const {
    badges,
    description,
    image,
    impactPoints,
    location,
    name,
    numberOfArtisans,
    productsSold,
    tagline,
    yearsActive,
  } = req.body;

  if (
    !badges ||
    !description ||
    !image ||
    !impactPoints ||
    !location ||
    !name ||
    !numberOfArtisans ||
    !productsSold ||
    !tagline ||
    !yearsActive
  )
    throw new Error("Missing fields! Please provide proper fields.");

  // TAKING BASE64 IMAGE AND CONVERTING IT TO AN IMAGE URL;
  const cloudinaryResponse = await uploadFileOnCloudinary(image, "artisans");
  if (!cloudinaryResponse) {
    throw new Error("Failed to upload image");
  }
  const clImgUrl = cloudinaryResponse.secure_url;

  // CREATING NEW CATEGORY;
  const newArtisan = formatToJSON(
    await Artisans.create({
      badges,
      description,
      image: clImgUrl,
      impactPoints,
      location,
      name,
      numberOfArtisans,
      productsSold,
      tagline,
      yearsActive,
    }),
  );

  if (!newArtisan)
    throw new Error("Unable to create new artisan. Some error occured!");

  res.status(201).json({
    status: true,
    data: newArtisan,
    msg: "A new artisan has been created successfully.",
  });
});

const listArtisans = asyncHandler(async (req, res) => {
  const artisans = formatToJSON(
    await Artisans.findAll({
      where: {
        isDeleted: 0,
      },
      attributes: [
        "id",
        "name",
        "location",
        "tagline",
        "description",
        "image",
        "numberOfArtisans",
        "yearsActive",
        "productsSold",
        "impactPoints",
        "badges",
      ],
    }),
  );

  if (!artisans)
    throw new Error("Unable to fetch artisans. Some error occured!");

  res.status(200).json({
    status: true,
    data: artisans,
    msg: "Artisans fetched successfully.",
  });
});

module.exports = {
  createArtisan,
  listArtisans,
};
