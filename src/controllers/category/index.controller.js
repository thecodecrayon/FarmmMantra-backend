const { Categories, Products, sequelize } = require("../../models/index.js");
const { asyncHandler, formatToJSON } = require("../../utils/index.js");
const { uploadFileOnCloudinary } = require("../../utils/cloudinary.js");

const createCategory = asyncHandler(async (req, res) => {
  const { image, name, description } = req.body;

  if (!image || !name || !description)
    throw new Error("Missing fileds! Unable to create category.");

  // TAKING BASE64 IMAGE AND CONVERTING IT TO AN IMAGE URL;
  const cloudinaryResponse = await uploadFileOnCloudinary(image, "categories");
  if (!cloudinaryResponse) {
    throw new Error("Failed to upload image");
  }

  const clImgUrl = cloudinaryResponse.secure_url;

  //   CREATING NEW CATEGORY;
  const newCategory = formatToJSON(
    await Categories.create({
      name,
      description,
      image: clImgUrl,
    }),
  );

  if (!newCategory)
    throw new Error("Unable to create new category. Some error occured!");

  res.status(201).json({
    status: true,
    data: newCategory,
    msg: "A new category has been created successfully.",
  });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = formatToJSON(
    await Categories.findAll({
      where: {
        isDeleted: 0,
      },
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Products.id")), "totalItems"],
        ],
      },
      include: [
        {
          model: Products,
          attributes: [],
          required: false,
        },
      ],
      group: [
        "Categories.id",
        "Categories.name",
        "Categories.image",
        "Categories.description",
      ],
    }),
  );

  if (!categories)
    throw new Error("Unable to fetch categories. Some error occured!");

  res.status(200).json({
    status: true,
    data: categories,
    msg: "Categories fetched successfully.",
  });
});

module.exports = {
  createCategory,
  listCategories,
};
