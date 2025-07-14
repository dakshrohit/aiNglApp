import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "YourApp <onboarding@resend.dev>", //add your domain here after adding it to Resend
      to: "dakshrohitsunkara@gmail.com" , // email, (as of now, everytime it sends to this fixed email used in signup of resend)
      subject: "Verification Email",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });
    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
}
