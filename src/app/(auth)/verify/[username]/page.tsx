'use client';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams() as { username: string }; 
    
    // console.log('Verify page - params:', params);
    // console.log('Verify page - username:', params.username);
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
       
      }); 

    
    

      const onSubmit=async(data: z.infer<typeof verifySchema>)=>{
        // console.log('Form data:', data);
        // console.log('Username from params:', params.username);
        try {
           const response= await axios.post<ApiResponse>(`/api/verify-code`,{
                username: params.username,
                code: data.code,
            })
            toast.success(response.data.message || "Account verified successfully!");
            router.replace(`/sign-in`);
            
        } catch (error) {
            console.error("Error in verify account:", error);
                  const axiosError = error as AxiosError<ApiResponse>;
                  // let errorMessage=axiosError.response?.data?.message || "An error occurred during signup.";
                  toast.error(
                    axiosError.response?.data?.message ||
                      "An error occurred during verification. Please try again."
                  );
            
        }
    }

  return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
      
  )
}

export default VerifyAccount
