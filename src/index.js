const env = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${env}` });

const app = require("./app.js");
const { sequelize } = require("./models");

const PORT = process.env.APP_PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Unable to connect to DB:", err.message);
  });
