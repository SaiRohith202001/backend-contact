const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (
    !mongoUri ||
    (!mongoUri.startsWith("mongodb://") &&
      !mongoUri.startsWith("mongodb+srv://"))
  ) {
    console.warn("MONGODB_URI is not set; skipping database connection.");
    return null;
  }

  try {
    const connectionInstance = await mongoose.connect(mongoUri);
    console.log(
      `\n MongoDB conncted !! DB HOST: ${connectionInstance.connection.host}`
    );
    return connectionInstance;
  } catch (error) {
    console.log("MONGODB connection failed ", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
