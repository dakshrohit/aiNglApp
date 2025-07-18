"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const router = useRouter();
  const [messageContent, setMessageContent] = useState<string>("");

  useEffect(() => {
    if (
      !params.username ||
      typeof username !== "string" ||
      username.trim() === ""
    ) {
      toast.error("Username is required to send a message.");
      router.replace("/");
    }
  }, [params.username, username, router]);

  // Helper to filter only likely questions
  const cleanSuggestions = (arr: string[]): string[] =>
    arr
      .map((q) => q.trim())
      .filter(
        (q) =>
          q.length > 0 &&
          q.length < 120 &&
          q.includes("?") &&
          // filter out any line that looks like AI explanation or prompt restatement
          !/^generate|here('|’)s|for example|return only|these questions/i.test(
            q
          )
      );

  const handleGetMessages = async () => {
    setIsSuggestionsLoading(true);
    setSuggestions([]);
    try {
      const response = await fetch("/api/suggest-messages", { method: "POST" });
      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiBuffer = "";
      const suggestionsArr: string[] = [];

      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const lines = decoder.decode(value, { stream: true }).split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.slice(6).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const chunk = JSON.parse(payload);
                const delta = chunk.choices?.[0]?.delta?.content ?? "";
                aiBuffer += delta;

                // Whenever you see '||', process it
                let split;
                while ((split = aiBuffer.indexOf("||")) !== -1) {
                  const suggestion = aiBuffer.slice(0, split).trim();
                  if (suggestion) suggestionsArr.push(suggestion);
                  aiBuffer = aiBuffer.slice(split + 2);
                  setSuggestions(cleanSuggestions([...suggestionsArr]));
                }
              } catch  { 
                // to gnore non-JSON or partial lines
                continue;
              }
            }
          }
        }
      }
      // At end, add whatever text remains as a last suggestion
      if (aiBuffer.trim()) {
        suggestionsArr.push(aiBuffer.trim());
        setSuggestions(cleanSuggestions([...suggestionsArr]));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages. Please try again later.", {
        duration: 5000,
      });
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const handleSendMessage = async (username: string, content: string) => {
    if (!username || !content.trim()) {
      toast.error("Username and message content are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          content,
        }),
      });
      const data = (await response.json()) as ApiResponse;
      if (!data.success) {
        toast.error(data.message || "Failed to send message.");
        return;
      }
      toast.success("Message sent successfully!", { duration: 3000 });
      setMessageContent(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-[#f4f8fc] to-[#e3e6ee] flex flex-col items-center py-10">
    <div className="w-full max-w-2xl mt-30 mx-auto mb-8">
      <Card className="mb-8 pt-2 pb-8 bg-white/80 shadow-lg border border-gray-100">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-center text-gray-900 tracking-tight mb-2">
            Profile Board
          </CardTitle>
          <p className="text-center text-base text-gray-500">
            Send an anonymous, friendly question to{" "}
            <span className="font-semibold text-indigo-700">
              @{username}
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            className="w-full p-3 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[70px] text-lg transition bg-white/80"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Ask something encouraging, deep, or just fun!"
            disabled={loading}
            rows={4}
          />
          <div className="flex gap-3 mt-4 justify-end">
            <Button
              onClick={handleGetMessages}
              disabled={isSuggestionsLoading || loading}
              className="font-semibold px-4 py-2 rounded-md"
            >
              {isSuggestionsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "AI Suggestions"
              )}
            </Button>
            <Button
              onClick={() => handleSendMessage(username, messageContent)}
              disabled={messageContent.trim() === "" || loading}
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SUGGESTION SECTION */}
      <Card className="mb-6 px-4 py-6 bg-white/95 border border-indigo-50 shadow">
        <CardHeader>
          <CardTitle className="font-semibold text-lg text-gray-800 mb-2">
            Or pick a suggestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {isSuggestionsLoading && (
              <div className="text-gray-400 italic text-center">
                AI is thinking...
              </div>
            )}
            {!isSuggestionsLoading && suggestions.length === 0 && (
              <div className="text-gray-300 italic text-center">
                No suggestions yet. Try AI Suggestions!
              </div>
            )}
            {suggestions.map((q, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                className="
                  border-indigo-200/70
                  bg-white
                  rounded-lg
                  px-4 py-3
                  text-gray-800 
                  shadow
                  hover:bg-indigo-50
                  hover:shadow-md
                  hover:scale-[1.025]
                  focus:bg-indigo-50
                  focus:ring-2 focus:ring-indigo-300
                  transition-all
                  duration-150
                  text-left
                  w-full
                  mb-2
                  whitespace-pre-line
                  break-words
                  font-semibold
                  
                "
                onClick={() => setMessageContent(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white/90 rounded-xl shadow p-4 mt-8 border flex flex-col items-center">
        <CardContent className="flex flex-col items-center">
          <span className="text-lg text-gray-700 font-semibold">
            Want your own anonymous feedback board?
          </span>
          <Button
            className="mt-4 transition font-bold px-6 py-2 rounded-lg text-white"
            onClick={() => router.push("/sign-up")}
          >
            Create Your Free Account
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

}
