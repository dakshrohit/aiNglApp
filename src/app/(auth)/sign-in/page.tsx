// "use client";

// import { useSession, signIn, signOut } from "next-auth/react"

// export default function Component() {
//   const { data: session } = useSession()
//   if (session) {
//     return (
//       <>
//         Signed in as {session.user.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     )
//   }
//   return (
//     <>
//       Not signed in <br />
//       <button className="bg-orange-500 px-3 py-1"  onClick={() => signIn()}>Sign in</button>
//     </>
//   )
// }
// 'use client';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import * as z  from 'zod';
// import Link from 'next/link';
// import { useDebounceValue } from 'usehooks-ts'
// import { toast } from "sonner"

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signInschema } from '@/schemas/signInSchema';


// const page = () => {
//   const [username,setUsername] = useState('');
//   const [usernameMessage, setUsernameMessage] = useState(''); 
//   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const debouncedUsername=useDebounceValue(username, 500,) //will wait for 500ms after the user stops typing and then update the value
//   const router= useRouter();


//   //zod implementation
//   const form=useForm<z.infer<typeof signInschema>>({
//     resolver:zodResolver(signInschema),
//     defaultValues:{
//       identifier:'',
//       password:'',
//     }

//   })
  


//   return (
//     <div>
      
//     </div>
//   )
// }

// export default page
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {  useState } from "react";
import { useRouter } from "next/navigation";
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
import { signInschema } from "@/schemas/signInSchema";
import { signIn  } from "next-auth/react";

const Page = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  


  //zod implementation
  const form = useForm<z.infer<typeof signInschema>>({

    resolver: zodResolver(signInschema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  }); //to use zod schema with react-hook-form
  



  const onSubmit = async (data: z.infer<typeof signInschema>) => {
    //signin logic using next-auth
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);
    if (result?.error) {
      toast.error(result.error || "Login failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (result?.url) {
      toast.success("Login successful!");
      setIsSubmitting(false);
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Not Gonna Lie
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="write your email/username..."
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
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a Member?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
