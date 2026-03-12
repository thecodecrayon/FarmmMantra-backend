const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let accessToken = null;

  if (typeof req.headers["authorization"] !== "undefined") {
    accessToken = req.headers["authorization"]?.replace("Bearer ", "");
  }

  if (!accessToken)
    return res.status(400)?.json({
      success: false,
      msg: "No access token found. You cannot access this route!",
    });

  let decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded)
    return res.status(401)?.json({
      success: false,
      msg: "Invalid access token. You are unauthorized to access this route!",
    });

  const { id, phone } = decoded;

  req.user = {
    id,
    phone,
  };

  next();
};

module.exports = { checkAuth };
