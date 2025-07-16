import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User.model";
import { signUpSchema } from "@/schemas/signUpSchema";

export async function POST(request:Request){
    await dbConnect();
    try {
        const body = await request.json();
        
        // // Validate the input data using Zod schema
        // const result = signUpSchema.safeParse(body);
        // if (!result.success) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "Invalid input data",
        //         errors: result.error.format()
        //     }, { status: 400 });
        // }

        const { username, email, password } = body;

        // Check if username already exists (both verified and unverified)
        const existingUserByUsername = await UserModel.findOne({ username,isVerified:true });

        if (existingUserByUsername) {
         
                return NextResponse.json({
                    success: false,
                    message: "Username already taken. Please choose a different username."
                }, { status: 400 });}
            
            // } else {
            //     // Username exists but is not verified - we need to check if it's the same user
            //     if (existingUserByUsername.email !== email) {
            //         return NextResponse.json({
            //             success: false,
            //             message: "Username already exists. Please choose a different username."
            //         }, { status: 400 });
            //     }

       const existingUserByEmail=await UserModel.findOne({
        email
       })
       const verifyCode= Math.floor(100000 + Math.random() * 900000).toString(); 
       if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return NextResponse.json({
                success: false,
                message: "Email already exists. Please choose a different email."
            }, { status: 400 });
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);
            
            existingUserByEmail.password=hashedPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600000); // 1 hour from now
            await existingUserByEmail.save();

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
            // isAcceptingMessages: true
        }, { status: 201 });
    }
    catch (error) {
        console.error("Error in sign-up route:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}
