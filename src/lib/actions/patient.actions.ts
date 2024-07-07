"use server";

import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createPatient = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );

    return parseStringify<Models.User<Models.Preferences>>(newUser);
  } catch (error) {
    if (error && error instanceof AppwriteException && error.code === 409) {
      const documents = await users.list([Query.equal("email", [user.email])]);

      return documents?.users[0];
    }

    throw error;
  }
};

export const getPatient = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify<Models.User<Models.Preferences>>(user);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
