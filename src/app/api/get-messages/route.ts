import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";

import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
// This route is used to get the messages of the user 
export async function GET() {  //removed the unused parameter _request
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id); //converts the userId which is a string to an ObjectId of User type
  //always use ObjectId when querying mongoose models specially when using aggregation pipelines
  try {
    const user = await UserModel.aggregate([ //using aggregation to get the messages of the user
        {
            $match:{_id:userId}
        },
        {
            $unwind:'$messages'
        },
        {
            $sort:{'messages.createdAt':-1}
        },
        {
            $group:{                //grouping the messages by userId sorting them by createdAt in descending order and pushing them into an array
                _id:'$_id',
                messages:{$push:'$messages'},
                // isAcceptingMessage:{$first:'$isAcceptingMessage'},
                // username:{$first:'$username'},
                // email:{$first:'$email'},
                // createdAt:{$first:'$createdAt'},
                // updatedAt:{$first:'$updatedAt'}
            }
        },
        {
            $project:{
                _id:1,
                messages:1,
                isAcceptingMessage:1,
                username:1,
                email:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ]);
    if(!user || user.length === 0) {
      return NextResponse.json(
        { success: false, message: "No messages found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during database connection:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
