"use client";

import { KeyboardEvent, useContext, useRef, useState } from "react";

import { AppContext } from "@/contexts/AppContext";
import { Cover, GenerateCoverResponse } from "@/types/cover";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();
  const { setCovers, user, fetchUserInfo } = useContext(AppContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    console.log("prompt", prompt);
    if (!prompt) {
      toast.error("请输入视频描述");
      inputRef.current?.focus();
      return;
    }
  
    if (!user) {
      toast.error("请先登录后再生成封面");
      router.push("/sign-in");
      return;
    }
  
    if (user.credits && user.credits.left_credits < 1) {
      toast.error("余额不足，请先充值");
      router.push("/pricing");
      return;
    }
  
    try {
      const params = {
        description: prompt,  // 改这里：prompt 改为 description
        negative_prompt: "blurry, low quality, distorted, pixelated"
      };
  
      setLoading(true);
      const resp = await fetch("/api/gen-cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      
      // 添加错误处理
      if (!resp.ok) {
        const text = await resp.text();
        console.error('API Error:', {
          status: resp.status,
          text
        });
        throw new Error(text);
      }
  
      const { code, message, data } = await resp.json();
      setLoading(false);
  
      if (code !== 0) {
        toast.error(message);
        return;
      }
  
      fetchUserInfo();
      setPrompt("");
  
      toast.success("生成成功");
      if (data) {
        console.log("new cover", data);
        setCovers((covers: Cover[]) => [data, ...covers]);
      }
    } catch (e) {
      console.error("gen cover failed", e);
      setLoading(false);
      toast.error(e instanceof Error ? e.message : "生成失败");
    }
  };
  
  return (
    <div className="relative max-w-2xl mx-auto mt-4 md:mt-16">
      <input
        type="text"
        className="mb-1 h-9 w-full rounded-md border border-solid border-primary px-3 py-6 text-sm text-[#333333] focus:border-primary"
        placeholder="输入要生成的视频描述"
        ref={inputRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleInputKeydown}
      />
      {loading ? (
        <button
          className="relative right-0 top-[5px] w-full cursor-pointer rounded-md bg-primary px-6 py-2 text-center font-semibold text-white sm:absolute sm:right-[5px] sm:w-auto"
          disabled
        >
          生成中...
        </button>
      ) : (
        <button
          className="relative right-0 top-[5px] w-full cursor-pointer rounded-md bg-primary border-primary px-6 py-2 text-center font-semibold text-white sm:absolute sm:right-[5px] sm:w-auto"
          onClick={handleSubmit}
        >
          生成封面
        </button>
      )}
    </div>
  );
}
