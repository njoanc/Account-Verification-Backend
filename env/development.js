const devConfig = {
  //database
  jwt_key: process.env.JWT_SECRET_KEY,

  jwt_expiration: 360000,

  dbConnectionString: process.env.MONGODB_URL,

  mongoDebug: true,
};

export default devConfig;
