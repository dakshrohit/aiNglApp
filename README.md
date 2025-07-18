# nglFeedback

nglFeedback is a smart feedback/social messaging platform built with Next.js, React, Tailwind CSS, NextAuth, AI integration, and MongoDB. It allows users to receive anonymous messages via a public profile link, with support for AI-generated suggestions and a secure, user-friendly dashboard.

## Features

- **Anonymous Messaging:**  
  Anyone can send feedback to users using their public `/u/[username]` profile link.

- **AI-Powered Suggestions:**  
  Visitors can generate engaging questions or comments for feedback, powered by LLMs (e.g., Mistral or OpenRouter).

- **Secure User Authentication:**  
  Authentication is handled via NextAuth and supports both email and username.

- **User Dashboard:**  
  Authenticated users can:
  - View, delete, and manage anonymous messages.
  - Toggle whether they’re accepting new messages.
  - Copy their public feedback link.
  - Enjoy real-time feedback with sonner toasts and a modern UI.

- **Modern Stack:**  
  Uses Next.js App Router, React 19, MongoDB with Mongoose, Tailwind CSS, shadcn/ui, and more.

## LLM Model Used for AI Suggestions

- **Model:**  
  AI suggestions are powered by the Mistral family of models (notably, `mistralai/mistral-small-3.2-24b-instruct:free`) or similar advanced LLMs available via the OpenRouter platform.
- **Serving Platform:**  
  The app integrates with the OpenRouter API for streaming LLM completions, enabling real-time, interactive suggestions.
- **Handling LLM Output:**  
  The frontend parses the model's streaming output and filters responses for natural, relevant suggestions.



## Demo
 
### Home Page
![homePage](/nextfeedback/public/homePageNgl.png)
### SignUp Page
![signUpNgl](/nextfeedback/public/signUpNgl.png)
### SignIn Page
![signInNgl](/nextfeedback/public/signInNgl.png)
### Dashboard Page
![dashboardNgl](/nextfeedback/public/dashboardNgl.png)
### Public URL Page
![publicUrlPgNgl](/nextfeedback/public/publicUrlPgNgl.png)






## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account or local MongoDB instance

### Installation

git clone https://github.com/dakshrohit/aiNglApp.git
cd nextfeedback
npm install


### Environment Variables

Create a `.env.local` file and fill in:

MONGODB_URI=your-mongodb-uri
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
OPENROUTER_API_KEY=your-openrouter-api-key
RESEND_API_KEY=your-resend-key


Update `NEXTAUTH_URL` and other endpoint URLs when deploying to Vercel or a custom domain.

### Development :
npm run dev


### Lint and Build

npm run lint
npm run build



### Production

npm start



## Usage

- **Send a Message:** Visit any user's public URL (e.g., `/u/username`) to leave an anonymous message—with or without AI help.
- **Dashboard:** Log in to view, manage, and delete messages.
- **Toggle Acceptance:** From the dashboard, control whether you are open to receiving new messages.
- **Email Verification:** When signing up, enter your email to receive an OTP (one-time password) through Resend. Enter this OTP to verify your account and start using all features immediately.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui, lucide-react
- **Backend:** Next.js API routes, Mongoose (MongoDB)
- **Authentication:** NextAuth.js (credentials provider)
- **AI Integration:** OpenRouter/Mistral
- **Forms & Validation:** react-hook-form, zod
- **Notifications:** sonner
- **Misc:** dayjs, axios, resend, embla-carousel (optional components)

## License

MIT License  
Copyright (c) [2025] 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.






