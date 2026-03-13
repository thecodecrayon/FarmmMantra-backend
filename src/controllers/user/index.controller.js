const { Users } = require("../../models/index.js");
const {
  asyncHandler,
  formatToJSON,
  generateAccessToken,
} = require("../../utils/index.js");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const getAllUsers = asyncHandler(async (req, res) => {
  let allUsers = formatToJSON(
    await Users.findAll({
      where: {
        id: {
          [Op.ne]: req.user?.id,
        },
      },
      attributes: ["id", "phone"],
    }),
  );

  if (!allUsers)
    throw new Error("Couldn't fetch the user list. Some error occured!");

  return res.status(200)?.json({
    success: true,
    users: allUsers,
    msg: "All users have been fetched successfully.",
  });
});

const createNewUser = asyncHandler(async (req, res) => {
  let { name, phone, password } = req.body;

  let newUserObj = {
    name,
    phone,
    password,
  };

  let newUser = formatToJSON(await Users.create(newUserObj));

  if (!newUser) {
    throw new Error("Unable to create new user. Some error occured!");
  }

  let { accessToken } = generateAccessToken({
    id: newUser?.id,
    phone: newUser?.phone,
  });

  let user = formatToJSON(
    await Users.findOne({
      where: {
        phone: phone,
      },
      attributes: ["id", "phone", "name"],
    }),
  );

  return res.status(201).json({
    success: true,
    user,
    accessToken,
    msg: "A new user has been created successfully.",
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let user = formatToJSON(
    await Users.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "phone", "name"],
    }),
  );

  if (!user) throw new Error("Unable to fetch user. Some error occured!");

  return res.status(201)?.json({
    success: true,
    user,
    msg: "User has been fetched successfully.",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  let { phone, password } = req.body;

  let user = formatToJSON(
    await Users.findOne({
      where: {
        phone,
      },
    }),
  );

  if (!user) throw new Error("Couldn't login. Invalid phone or password!");

  // let isValidPassword = await bcrypt.compare(password, user?.password);
  // SINCE IT'S A SIMPLE 1-USER LOGIN FOR ADMIN PANEL WITH RESET FUNCTIONALITY, I'M DISABLING HASHING;
  let isValidPassword = password === user?.password;

  if (!isValidPassword)
    throw new Error("Couldn't login. Invalid phone or password!");

  let { accessToken } = generateAccessToken({
    id: user?.id,
    phone: user?.phone,
  });

  user = formatToJSON(
    await Users.findOne({
      where: {
        phone,
      },
      attributes: ["id", "phone", "name"],
    }),
  );

  return res.status(200)?.json({
    success: true,
    user,
    accessToken,
    msg: "User logged in successfully.",
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "User logged out successfully.",
  });
});

module.exports = {
  getAllUsers,
  createNewUser,
  getUserById,
  loginUser,
  logoutUser,
};
