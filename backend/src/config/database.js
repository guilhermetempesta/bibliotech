require('dotenv').config();

module.exports = {
  "development": {
    "dialect": "postgres",
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "database": process.env.DB_DATABASE,
    "define": {
      "timestamps": true,
      "underscored": true
    },
    "seederStorage": "sequelize"
  },
  "production": {
    "dialect": "postgres",
    "username": process.env.DB_USERNAME || ELECTRON_WEBPACK_APP_DB_USERNAME,
    "password": process.env.DB_PASSWORD || ELECTRON_WEBPACK_APP_DB_PASSWORD,
    "host": process.env.DB_HOST || ELECTRON_WEBPACK_APP_DB_HOST,
    "port": process.env.DB_PORT || ELECTRON_WEBPACK_APP_DB_PORT,
    "database": process.env.DB_DATABASE || ELECTRON_WEBPACK_APP_DB_DATABASE,
    "define": {
      "timestamps": true,
      "underscored": true
    },
    "seederStorage": "sequelize"
  }
}