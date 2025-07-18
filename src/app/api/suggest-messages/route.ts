// import { generateText } from 'ai';
// import { groq } from '@ai-sdk/groq';

// // 1. Generate conversation continuations
// export async function generateMessageSuggestions(input: string) {
//   const { text } = await generateText({
//     model: groq('llama3-70b-8192', { supportedUrls: ['https://api.groq.com'] }), // Best for creative suggestions
//     system: `You are a helpful message suggester. Provide exactly 3 short, natural 
//             conversation continuations (5-10 words each) formatted as a markdown list.`,
//     prompt: `Suggest replies to: "${input}"`,
//     temperature: 0.7, // Controls creativity
//     max_tokens: 150   // Limit response length
//   });

//   return text;
// }

// import { createGroq } from '@ai-sdk/groq';
// import { streamText } from 'ai';
// import { StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// // Initialize Groq following v5 SDK docs
// const groq = createGroq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // Using streamText as per v5 SDK
//     const result = await streamText({
//       model: groq('llama3-70b-8192'), // Model specified per v5 docs
//       system: 'You are a helpful question generator for a social platform.',
//       prompt,
//       max_tokens: 400,
//     });

//     // Convert to streaming response
//     const stream = result.toAIStream();
//     return new StreamingTextResponse(stream);

//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// import { createOpenAI } from 'ai';
// import { Groq } from 'ai/providers/groq';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// export const runtime = 'edge';

// /* 1️⃣  Initialise Groq (OpenAI‑compatible) */
// const groq = createOpenAI(
//   new Groq({
//     apiKey: process.env.AI_GROQ_API_KEY!,          // <- put this in .env.local
//   })
// );

// /* 2️⃣  POST handler */
// export async function POST() {
//   try {
//     const prompt =
//       "Create a list of three open‑ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     /* 3️⃣  Call Groq’s Llama‑3 with streaming */
//     const result = await groq.chat({
//       model: 'llama3-70b-8192',
//       stream: true,
//       messages: [
//         { role: 'user', content: prompt }
//       ],
//       max_tokens: 400
//     });

//     /* 4️⃣  Pipe to stream helper */
//     const stream = OpenAIStream(result);
//     return new StreamingTextResponse(stream);

//   } catch (error: any) {
//     // Groq uses OpenAI‑compatible errors
//     if (error?.status) {
//       const { name, status, headers, message } = error;
//       return NextResponse.json({ name, status, headers, message }, { status });
//     }
//     console.error('Unexpected error:', error);
//     throw error;
//   }
// }
  
// const url = "https://openrouter.ai/api/v1/chat/completions";
// const headers = {
//   "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
//   "Content-Type": "application/json"
// };
// const payload = {
//   "messages": [
//     {
//       "role": "user",
//       "content": "If you built the world's tallest skyscraper, what would you name it?"
//     }
//   ]
// };

// const response = await fetch(url, {
//   method: "POST",
//   headers,
//   body: JSON.stringify(payload)
// });

// const data = await response.json();
// console.log(data);
// import { OpenAI } from 'openai'; // Using native OpenAI client instead
// import { OpenAIStream, StreamingTextResponse } from 'ai';

// // Configure to point to OpenRouter
// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: 'https://openrouter.ai/api/v1'
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();
    
//     const response = await openai.chat.completions.create({
//       model: 'mistralai/mistral-small-3.1',
//       stream: true,
//       messages
//     });

//     const stream = OpenAIStream(response);
//     return new StreamingTextResponse(stream);
    
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ error: 'Failed to generate response' }),
//       { status: 500 }
//     );
//   }
// }
 

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() { //removed the unused parameter req
  try {
    // const { prompt } = await req.json(); // Extract the prompt from the request body given by the user
const prompt = `
Generate exactly three open-ended, engaging questions for strangers on an anonymous social messaging platform. Return ONLY the questions, as a single string, separated by '||', with NO extra text or explanation.
For example: What inspires you?||If you could travel anywhere, where would you go?||What's your favorite way to relax?
`


    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterApiKey) {
      return NextResponse.json({ error: 'Missing OpenRouter API Key' }, { status: 500 });
    }

    // Prepare the OpenRouter API request for streaming chat completions
    const requestBody = {
      model: 'mistralai/mistral-small-3.2-24b-instruct:free', // Use your desired model id here
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: 400, // will be adjusted based the needs
       
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openrouterApiKey}`, // Use the environment variable`,

        //'HTTP-Referer': 'https://www.sitename.com', // optional, omit if you have no domain
        'X-Title': 'MyOpenRouterApp',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.body) {
      return NextResponse.json({ error: 'No response from OpenRouter' }, { status: 500 });
    }

    // Streaming the response back to the client as-is (SSE chunks)
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }); 

 
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

