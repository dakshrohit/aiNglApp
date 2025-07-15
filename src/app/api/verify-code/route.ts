import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import { z } from "zod";

export async function POST(request: Request) {
    await dbConnect();
    try {
       const {username,code}= await request.json()
      const decodedUsername= decodeURIComponent(username) // Decode the username to handle any URL encoding
     const user= await UserModel.findOne({
        username:decodedUsername
      })
      if(!user){
        return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
        );
      }

      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
      if(isCodeValid && isCodeNotExpired){

        user.isVerified = true;
       
        await user.save();
        return NextResponse.json(
            { success: true, message: "User Account verified successfully" },
            { status: 200 }
        );
      } else if(!isCodeNotExpired) {
        return NextResponse.json(
            { success: false, message: "Verification code has expired, please sign up again to get a new code" },
            { status: 400 }
        );

      } else{
        return NextResponse.json(
            { success: false, message: "Invalid verification code" },
            { status: 400 }
        );
      }

        
    } catch (error) {
        console.error("Error during database connection:", error);
        
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
        
    }
}