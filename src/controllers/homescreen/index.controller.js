const { asyncHandler } = require("../../utils/index.js");
const { Category, Product, Artisan } = require("../../models/index.js");
const { Op } = require("sequelize");

const getHomescreenData = asyncHandler(async (req, res) => {
  // GET 7 CATEGORIES WITH NAME AND IMAGE
  const categories = await Category.findAll({
    where: {
      isDeleted: 0,
    },
    attributes: ["id", "name", "image"],
    limit: 7,
    order: [["createdAt", "ASC"]],
  });

  // GET ALL PRODUCTS FOR THESE CATEGORIES AT ONCE
  const categoryIds = categories.map((cat) => cat.id);

  const allProducts = await Product.findAll({
    where: {
      categoryId: {
        [Op.in]: categoryIds,
      },
      isDeleted: 0,
      defaultQuantity: {
        [Op.gt]: 0,
      },
    },
    attributes: [
      "id",
      "name",
      "description",
      "price",
      "discountInPercent",
      "images",
      "defaultQuantity",
      "quantityNote",
      "categoryId",
    ],
    order: [
      ["categoryId", "ASC"],
      ["createdAt", "DESC"],
    ],
  });

  // GROUP PRODUCTS BY CATEGORY AND LIMIT TO 10 PER CATEGORY
  const productsByCategory = categories.map((category) => {
    const categoryProducts = allProducts
      .filter((product) => product.categoryId === category.id)
      .slice(0, 10) // LIMIT TO 10 PRODUCTS PER CATEGORY;
      .map((product) => ({
        id: product.id,
        title: product.name,
        image: product.images?.[0] || null,
        price: product.price,
        description: product.description,
        discountInPercent: product.discountInPercent,
        discountedPrice:
          product.discountInPercent > 0
            ? Math.round(
                product.price -
                  (product.price * product.discountInPercent) / 100,
              )
            : product.price,
      }));

    return {
      id: category.id,
      title: category.name,
      data: categoryProducts, // EMPTY ARRAY IF NO PRODUCTS ARE AVAILABLE;
    };
  });

  return res.status(200).json({
    status: true,
    data: {
      categories: [
        ...categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          image: cat.image,
        })),
        {
          id: null,
          image: "",
          name: "All Category",
        },
      ],
      productsByCategory: productsByCategory,
    },
    msg: "Homescreen data fetched successfully.",
  });
});

module.exports = {
  getHomescreenData,
};
