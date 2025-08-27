/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoError } from "mongodb";
import User, { IUser } from "../models/user.model";


export const userService = {
  createUserData: async (userData: Partial<IUser>) => {
    const { email } = userData;

    const user = new User(userData);

    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        console.log("Conflicting user:", existingUser);
        throw new Error("A user with this email already exists.");
      }

      await user.save();
      return user;
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        console.error("Duplicate key error:", error);
        throw new Error("A user with this email already exists.");
      }
      console.error("Error creating user in MongoDB:", error);
      throw error;
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  },


};

