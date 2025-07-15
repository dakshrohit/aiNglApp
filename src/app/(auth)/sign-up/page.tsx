"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500); //will wait for 500ms after the user stops typing and then update the value
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  }); //to use zod schema with react-hook-form
  

  useEffect(() => {
    const isCheckingUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true); //checking username
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log(response);
          // console.log(response.data.message);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data?.message ||
            "Error checking username uniqueness")
        } finally {
          // always executed
          setIsCheckingUsername(false); //finished checking username
        }
      }
    };
    isCheckingUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    console.log(data); // -> the data validated by zod schema
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data); // data is the form data

      console.log(response.data.message);
      toast.success(response.data.message || `Account created successfully!`);
      // router.replace(`/verify/${username}`);// may have unupdated username due to debounce, so we should use the updated value from the form data ie data.username
      router.replace(`/verify/${data.username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      // let errorMessage=axiosError.response?.data?.message || "An error occurred during signup.";
      toast.error(
        axiosError.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Not Gonna Lie
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="write your username..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value); //wrote this only to update my username state which i wrote explicitly, otherwise react-hook-form will handle the value on its own
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin h-4 w-4" />
                  )}
                  <p className={`text-sm ${usernameMessage==="Username is available"? "text-green-600" : "text-red-600"}`}>
                  {usernameMessage}
                  </p>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="write your email..."
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="write your password..."
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  PLease wait...
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
