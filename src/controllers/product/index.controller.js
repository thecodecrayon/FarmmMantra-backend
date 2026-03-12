const { Artisan, Category, Product } = require("../../models/index.js");
const { uploadFileOnCloudinary } = require("../../utils/cloudinary.js");
const { asyncHandler, formatToJSON } = require("../../utils/index.js");

const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({
    where: {
      isDeleted: 0,
    },
    attributes: [
      "artisanId",
      "categoryId",
      "description",
      "discountInPercent",
      "images",
      "keyFeatures",
      "name",
      "price",
      "defaultQuantity",
      "quantityNote",
      "subtitle",
    ],
    include: [
      {
        model: Category,
        attributes: ["id", "name", "image"],
      },
      {
        model: Artisan,
        attributes: ["id", "name", "image"],
      },
    ],
  });

  if (!products)
    throw new Error("Unable to fetch products. Some error occured!");

  res.status(200).json({
    status: true,
    data: products,
    msg: "Products fetched successfully.",
  });
});

const createNewProduct = asyncHandler(async (req, res) => {
  const {
    artisanId,
    categoryId,
    description,
    discountInPercent,
    images,
    keyFeatures,
    name,
    price,
    defaultQuantity,
    quantityNote,
    subtitle,
  } = req.body;

  if (
    !artisanId ||
    !categoryId ||
    !description ||
    !discountInPercent ||
    !images ||
    !keyFeatures ||
    !name ||
    !price ||
    !defaultQuantity ||
    !quantityNote ||
    !subtitle
  )
    throw new Error("Missing fields! Please provide necessary fields.");

  // TAKING BASE64 IMAGE ARRAY AND CONVERTING IT TO CLOUDINARY URLS;
  const promisePending = images.map((image) =>
    uploadFileOnCloudinary(image, "products"),
  );
  const resolveAll = await Promise.allSettled(promisePending);

  if (!resolveAll) {
    throw new Error("Failed to upload images to the cloudinary!");
  }
  const clImgUrls = resolveAll.map((item) => item.value.secure_url);

  //   CREATING NEW PRODUCT;
  const newProduct = formatToJSON(
    await Product.create({
      artisanId,
      categoryId,
      description,
      discountInPercent,
      images: clImgUrls,
      keyFeatures,
      name,
      price,
      defaultQuantity,
      quantityNote,
      subtitle,
    }),
  );

  if (!newProduct)
    throw new Error("Unable to create new product. Some error occured!");

  res.status(201).json({
    status: true,
    data: newProduct,
    msg: "Product created successfully",
  });
});

const listProductOptions = asyncHandler(async (req, res) => {
  const categories = formatToJSON(
    await Category.findAll({
      where: {
        isDeleted: 0,
      },
      attributes: ["id", "name"],
    }),
  );

  if (!categories)
    throw new Error("Unable to fetch categories. Some error occured!");

  const artisans = formatToJSON(
    await Artisan.findAll({
      where: {
        isDeleted: 0,
      },
      attributes: ["id", "name"],
    }),
  );

  if (!artisans)
    throw new Error("Unable to fetch artisans. Some error occured!");

  res.status(200).json({
    status: true,
    data: {
      categories,
      artisans,
    },
    msg: "Options fetched successfully.",
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // CHECK IF THE PRODUCT EXISTS WITHIN THIS ID;
  let product = await Product.count({
    where: {
      id,
      isDeleted: 0,
    },
  });

  if (product === 0)
    return res.status(200).json({
      status: false,
      data: null,
      msg: "Product with this id doesn't exist!",
    });

  product = formatToJSON(
    await Product.findOne({
      where: {
        id,
        isDeleted: 0,
      },
      attributes: [
        "id",
        "name",
        "images",
        "subtitle",
        "price",
        "discountInPercent",
        "quantityNote",
        "description",
        "keyFeatures",
        "artisanId",
      ],
      include: [
        {
          model: Artisan,
          attributes: [
            "id",
            "name",
            "image",
            "location",
            "tagline",
            "description",
            "numberOfArtisans",
            "yearsActive",
            "productsSold",
            "impactPoints",
            "badges",
          ],
        },
      ],
    }),
  );

  if (!product) throw new Error("Unable to fetch product. Some error occured!");

  res.status(200).json({
    status: true,
    data: product,
    msg: "Product fetched successfully.",
  });
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get category
  const category = formatToJSON(
    await Category.findOne({
      where: {
        id,
        isDeleted: 0,
      },
      attributes: ["id", "name"],
    }),
  );

  if (!category) throw new Error("Category not found!");

  // Get products separately
  const products = await Product.findAll({
    where: {
      categoryId: id,
      isDeleted: 0,
    },
    attributes: ["id", "name", "price", "discountInPercent", "images"],
    limit: 30,
    order: [["createdAt", "DESC"]],
  });

  // Get total count
  const totalCount = await Product.count({
    where: {
      categoryId: id,
      isDeleted: 0,
    },
  });

  res.status(200).json({
    status: true,
    data: {
      ...category,
      products: products,
      totalCount,
    },
    msg: "Products fetched successfully.",
  });
});

module.exports = {
  listProducts,
  createNewProduct,
  listProductOptions,
  getProductById,
  getProductsByCategory,
};
