import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { error } from "console";

export async function DELETE(request: Request,{params}:{params:{messageid:string}}) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
   const updateResult= await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }
    )
    if(updateResult.modifiedCount === 0) {
      console.error("Message not found or already deleted",error);
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    
  }
  
}
