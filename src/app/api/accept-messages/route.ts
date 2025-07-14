import { getServerSession } from "next-auth";
import  dbConnect  from "@/lib/dbConnect";
import { authOptions } from '../auth/[...nextauth]/options';

import { NextResponse } from "next/server";
import UserModel  from "@/model/User.model";
import { User } from "next-auth";

// This function handles the POST request to update the user's acceptance of messages
export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json(); //flag to accept or reject messages
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: `User status updated to ${acceptMessages ? "accepting" : "not accepting"} messages`,
        updatedUser, //` Return the updated user document
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("failed to update user status to accept messages: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}
// This function handles the GET request to check if the user is accepting messages
export async function GET(request:Request){
    
    await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const foundUser=await UserModel.findById(userId)
    if(!foundUser){
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
      return NextResponse.json(
          {
              success: true,
              isAcceptingMessage: foundUser.isAcceptingMessage,
              message: "User status fetched successfully",
          },
          { status: 200 }
          );
  } catch (error) {
    console.error("Error fetching user status", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching user status",
      },
      { status: 500 }
    );
    
  }

}