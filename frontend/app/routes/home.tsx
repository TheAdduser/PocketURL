import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import type React from "react";
import { useState } from "react";
import { Link } from "react-router";
import { Link as LinkIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_URL, FRONTEND_URL } from "~/constants";
import { Input } from "~/components/ui/input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PocketURL" },
    { name: "description", content: "Welcome to PocketURL!" },
  ];
}

function InputBar() {
  const [url, setURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  };

  const { mutate } = useMutation({
    mutationFn: async (url: string) => {
      console.log("abc");
      setIsLoading(true);
      const req = await fetch(`${API_URL}/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });
      if (!req.ok) {
        throw new Error("Request failed");
      }

      const body = await req.json();
      return body.shortened;
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Something went wrong");
    },
    onSuccess: async (shortened: string) => {
      setIsLoading(false);
      setURL("");
      toast(`New shortened url created: ${shortened}`, {
        action: {
          label: "Copy",
          onClick: () => {
            navigator.clipboard.writeText(`${FRONTEND_URL}/${shortened}`);
          },
        },
      });
    },
  });

  const handleClick = () => {
    if (!isLoading) {
      mutate(url);
    }
  };

  return (
    <div className="flex gap-4 w-full">
      <div className="w-full space-y-2">
        <div className="relative w-full">
          <LinkIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-background pl-9 w-full"
            id="url-input"
            placeholder="https://example.com"
            type="url"
            onChange={handleChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Include https:// or http://
        </p>
      </div>
      <Button onClick={handleClick}>Create</Button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col bg-[url(/bgbig.jpg)] bg-cover min-h-screen min-w-screen items-center justify-center p-4">
      <div className="px-4 w-full h-full max-w-4xl max-h-96 bg-white/20 rounded-xl backdrop-blur-lg flex flex-col justify-around gap-16">
        <div className="gap-16 flex flex-col">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-center text-4xl sm:text-6xl font-extrabold text-slate-50 text-shadow-black text-shadow-2xs">
              Pocket<span className="text-violet-500">URL</span>
            </h1>
            <h2 className="text-slate-200 font-bold text-sm sm:text-xl text-center">
              No point in remembering URLs any longer
            </h2>
          </div>
          <InputBar />
        </div>
        <Link
          to="/dashboard"
          className="bg-violet-500 align-center text-center py-2 rounded-xl"
        >
          SEE DASHBOARD
        </Link>
      </div>
    </div>
  );
}
