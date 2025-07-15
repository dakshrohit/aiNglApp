import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import {  z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
// import { signUpSchema } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  //check if the request is a GET request-> no need to check in app router as it is already handled by Next.js

  await dbConnect();

  //localhost:27017/api/check-username-unique?username=daksh?phone=1234567890

  try {
    //we will get the username from the query parameters and check if it exists in the database
    const { searchParams } = new URL(request.url); // destructuring the URL object to get the search params
    const queryParam = {
      username: searchParams.get("username") || "",
    };
    //validate the query parameters using zod schema
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("result", result);
    if (!result.success) {
      const errorTree = z.treeifyError(result.error);
      const usernameErrors = errorTree.properties?.username?.errors ?? [];
      return NextResponse.json(
        {
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
          success: false,
        },
        { status: 400 }
      );
    }
    //validation passed, now we can check if the username exists in the database
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during database connection:", error);
    return NextResponse.json(
      { error: "Database connection failed", success: false },
      { status: 500 }
    );
  }
}
