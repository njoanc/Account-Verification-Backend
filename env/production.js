const prodConfig = {
  //database

  jwt_key: process.env.JWT_SECRET_KEY,

  jwt_expiration: 360000,

  dbConnectionString: process.env.MONGODB_URI_PRO,

  mongoDebug: false,
};

export default prodConfig;
