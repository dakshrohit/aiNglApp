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

import React from 'react'

const page = () => {
  return (
    <div>
      sign in page
    </div>
  )
}

export default page
