import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User.model";

export async function POST(request:Request){
    await dbConnect();
    try {
       const {username,email,password} =await request.json()
       const existingUserVerifiedByUsername=await UserModel.findOne({
        username,isVerified:true
       })
       if(existingUserVerifiedByUsername){
        return NextResponse.json({
            success: false,
            message: "Username already exists. Please choose a different username."
        }, { status: 400 });
       }

       const existinUserByEmail=await UserModel.findOne({
        email,isVerified:true
       })
       const verifyCode= Math.floor(100000 + Math.random() * 900000).toString(); 
       if(existinUserByEmail){
        if(existinUserByEmail.isVerified){
            return NextResponse.json({
                success: false,
                message: "Email already exists. Please choose a different email."
            }, { status: 400 });
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);
            existinUserByEmail.password=hashedPassword;
            existinUserByEmail.verifyCode=verifyCode;
            existinUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600000); // 1 hour from now
            await existinUserByEmail.save();

        }
       } else{
        const hashedPassword=await bcrypt.hash(password,10);
        const expiryDate=new Date();
        expiryDate.setHours(expiryDate.getHours()+1);
       const newUser= new UserModel({
        username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified:false,
            isAcceptingMessage: true,
            messages: []
        })
        await newUser.save();

       }
       //send verification email
       const emailResponse=await sendVerificationEmail(email, username, verifyCode);
       if(!emailResponse.success){
        return NextResponse.json({
            success: false,
            message: emailResponse.message
        }, { status: 500 });
       }
        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please check your email for the verification code.",
            isAcceptingMessages: true
        }, { status: 201 });

       

        
    } catch (error) {
        console.error("Error in sign-up route:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}