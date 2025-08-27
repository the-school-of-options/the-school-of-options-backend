import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

const connectToMongo = async (uri: string): Promise<void> => {
  if (!uri) {
    throw new Error("MongoDB URI is not defined");
  }

  try {
    await mongoose.connect(uri);
    console.log(
      `MongoDB connection established to: ${mongoose.connection.name}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.name === "MongoServerError" &&
        error.message.includes("bad auth")
      ) {
        console.error(
          "MongoDB Authentication Failed. Please check your credentials.",
        );
      } else {
        console.error(
          `MongoDB connection error: ${error.name} - ${error.message}`,
        );
      }
    } else {
      console.error("An unexpected error occurred while connecting to MongoDB");
    }
    process.exit(1);
  }
};

export const connectToProdDb = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || " mongodb+srv://tech:H4tsJCTcXIKcOtnN@cluster0.qhgm4ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  console.log("Current URI:", uri);
  if (!uri) {
    throw new Error(
      "Production MongoDB URI is not defined in environment variables",
    );
  }
  await connectToMongo(uri);
};

export const connectToTestDb = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Test MongoDB URI is not defined in environment variables");
  }
  await connectToMongo(uri);
};
