const jwt = require("jsonwebtoken");

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log("Error:", err);
      return res.status(500).json({
        status: false,
        msg: err.message || err,
      });
    });
  };
};

function formatToJSON(query) {
  return JSON.parse(JSON.stringify(query));
}

const generateAccessToken = (userObj) => {
  try {
    let accessToken = jwt.sign(
      {
        ...userObj,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    return { accessToken };
  } catch (err) {
    throw err;
  }
};

module.exports = { asyncHandler, formatToJSON, generateAccessToken };
