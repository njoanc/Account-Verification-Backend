const url = process.env.MONGODB_URL;

console.log("connecting to", url);

const connectMongo = mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

export default connectMongo;
