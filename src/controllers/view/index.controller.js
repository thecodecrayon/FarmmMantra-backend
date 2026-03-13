const { Op } = require("sequelize");
const {
  Artisans,
  Categories,
  Products,
  Views,
  sequelize,
} = require("../../models/index.js");
const { asyncHandler } = require("../../utils/index.js");

const getViewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const viewCount = await Views.count({
    where: {
      productId,
    },
  });

  if (!viewCount)
    throw new Error("Unable to get view count. Some error occured!");

  return res.status(200).json({
    status: true,
    data: {
      productId,
      viewCount: viewCount,
    },
    msg: "View count fetched successfully.",
  });
});

const addViewsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // GET IP ADDRESS FROM REQUEST;
  const ipAddress =
    req.ip ||
    req.connection.remoteAddress ||
    req.headers["x-forwarded-for"]?.split(",")[0];

  //CHECK IF THE IP ALREADY VIEWED THE PRODUCT TODAY (TO PREVENT SPAM);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingView = await Views.findOne({
    where: {
      productId,
      ipAddress: ipAddress,
      createdAt: {
        [Op.gte]: today,
      },
    },
  });

  if (existingView) {
    // DON'T CREATE DUPLICATE, BUT STILL RETURN SUCCESS WITH CURRENT COUNT;
    const viewCount = await Views.count({
      where: {
        productId,
      },
    });

    return res.status(200).json({
      status: true,
      data: {
        productId,
        viewCount: viewCount,
      },
      msg: "View already recorded for today.",
    });
  }

  // CREATING NEW VIEW;
  await Views.create({
    productId,
    ipAddress: ipAddress,
  });

  // GETTING UPDATED COUNT;
  const viewCount = await Views.count({
    where: {
      productId,
    },
  });

  return res.status(201).json({
    status: true,
    data: {
      productId,
      viewCount: viewCount,
    },
    msg: "View recorded successfully.",
  });
});

const getOverallViews = asyncHandler(async (req, res) => {
  // GET TOTAL VIEW COUNT ACROSS ALL PRODUCTS
  const totalViews = await Views.count();

  // GET TOTAL PRODUCTS
  const totalProducts = await Products.count({
    where: {
      isDeleted: 0,
    },
  });

  // GET ACTIVE LISTINGS (products with stock > 0)
  const activeListings = await Products.count({
    where: {
      isDeleted: 0,
      defaultQuantity: {
        [Op.gt]: 0,
      },
    },
  });

  // GET TOTAL ARTISANS
  const totalArtisans = await Artisans.count({
    where: {
      isDeleted: 0,
    },
  });

  // GET TOTAL CATEGORIES
  const totalCategories = await Categories.count({
    where: {
      isDeleted: 0,
    },
  });

  // GET VIEWS THIS MONTH
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const viewsThisMonth = await Views.count({
    where: {
      createdAt: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  // GET VIEWS LAST MONTH (for percentage calculation)
  const startOfLastMonth = new Date(startOfMonth);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

  const viewsLastMonth = await Views.count({
    where: {
      createdAt: {
        [Op.gte]: startOfLastMonth,
        [Op.lt]: startOfMonth,
      },
    },
  });

  // CALCULATE PERCENTAGE CHANGE FOR VIEWS
  const viewsPercentageChange =
    viewsLastMonth > 0
      ? Math.round(((viewsThisMonth - viewsLastMonth) / viewsLastMonth) * 100)
      : 0;

  // GET PRODUCTS ADDED THIS MONTH
  const productsThisMonth = await Products.count({
    where: {
      isDeleted: 0,
      createdAt: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  const productsLastMonth = await Products.count({
    where: {
      isDeleted: 0,
      createdAt: {
        [Op.gte]: startOfLastMonth,
        [Op.lt]: startOfMonth,
      },
    },
  });

  const productsPercentageChange =
    productsLastMonth > 0
      ? Math.round(
          ((productsThisMonth - productsLastMonth) / productsLastMonth) * 100,
        )
      : 0;

  // GET ARTISANS ADDED THIS MONTH
  const artisansThisMonth = await Artisans.count({
    where: {
      isDeleted: 0,
      createdAt: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  const artisansLastMonth = await Artisans.count({
    where: {
      isDeleted: 0,
      createdAt: {
        [Op.gte]: startOfLastMonth,
        [Op.lt]: startOfMonth,
      },
    },
  });

  const artisansPercentageChange =
    artisansLastMonth > 0
      ? Math.round(
          ((artisansThisMonth - artisansLastMonth) / artisansLastMonth) * 100,
        )
      : 0;

  // GET VIEW COUNT PER PRODUCT (TOP PRODUCTS)
  const viewsByProduct = await Views.findAll({
    attributes: [
      "productId",
      [sequelize.fn("COUNT", sequelize.col("Views.id")), "viewCount"],
    ],
    include: [
      {
        model: Products,
        attributes: ["id", "name", "images"],
        required: true,
        where: {
          isDeleted: 0,
        },
      },
    ],
    group: [
      "Views.productId",
      "Products.id",
      "Products.name",
      "Products.images",
    ],
    order: [[sequelize.fn("COUNT", sequelize.col("Views.id")), "DESC"]],
    limit: 10,
  });

  // FORMATTING TOP PRODUCTS
  const formattedTopProducts = viewsByProduct.map((item) => ({
    productId: item.productId,
    productName: item.Product.name,
    productImage: item.Product.images?.[0] || null,
    viewCount: parseInt(item.dataValues.viewCount),
  }));

  // GET TOP CATEGORIES BY VIEW COUNT
  const topCategories = await Views.findAll({
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("Views.id")), "viewCount"],
    ],
    include: [
      {
        model: Products,
        attributes: [],
        required: true,
        where: {
          isDeleted: 0,
        },
        include: [
          {
            model: Categories,
            attributes: ["id", "name"],
            required: true,
            where: {
              isDeleted: 0,
            },
          },
        ],
      },
    ],
    group: ["Products->Categories.id", "Products->Categories.name"],
    order: [[sequelize.fn("COUNT", sequelize.col("Views.id")), "DESC"]],
    limit: 5,
    raw: true,
  });

  // GET MAX VIEW COUNT FOR PERCENTAGE CALCULATION
  const maxCategoryViews =
    topCategories.length > 0 ? parseInt(topCategories[0].viewCount) : 1;

  // FORMAT TOP CATEGORIES
  const formattedTopCategories = topCategories.map((item) => ({
    id: item["Products.Categories.id"],
    name: item["Products.Categories.name"],
    viewCount: parseInt(item.viewCount),
    percentage: Math.round((parseInt(item.viewCount) / maxCategoryViews) * 100),
  }));

  return res.status(200).json({
    status: true,
    data: {
      // STATS FOR DASHBOARD CARDS
      stats: {
        activeListings: activeListings,
        totalProducts: totalProducts,
        activeListingsPercentage: productsPercentageChange,

        totalViews: totalViews,
        viewsThisMonth: viewsThisMonth,
        viewsPercentage: viewsPercentageChange,

        totalArtisans: totalArtisans,
        artisansPercentage: artisansPercentageChange,

        totalCategories: totalCategories,
      },

      // TOP VIEWED PRODUCTS
      topProducts: formattedTopProducts,

      // TOP CATEGORIES BY VIEWS
      topCategories: formattedTopCategories,
    },
    msg: "Overall statistics fetched successfully.",
  });
});

module.exports = {
  getViewsByProduct,
  addViewsByProduct,
  getOverallViews,
};
