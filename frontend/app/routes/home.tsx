import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import type React from "react";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "PocketURL" },
    { name: "description", content: "Welcome to PocketURL!" },
  ];
}

function InputBar() {
  const [url, setURL] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  }

  const handleClick = () => {
  }

  return (
    <div className="border-2 mt-8 flex justify-between h-10 border-black xl:h-12 rounded-md shadow-xl">
      <input type="text" placeholder="type or paste a link" onChange={handleChange} className="p-1 w-full h-full bg-white rounded-l-md"/>
      <button className="bg-pink-700 rounded-r-sm h-full text-sm font-bold p-1 xl:w-36" onClick={handleClick}>Shorten</button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="py-16 border-2 w-full h-full px-3 flex flex-col bg-[url(/bg.jpg)] lg:bg-[url(/bgbig.jpg)] bg-cover xl: items-center">
      <div className="w-full h-full bg-white/30 p-4 pt-12 rounded-xl backdrop-blur-lg flex flex-col justify-between xl:w-4/5">
        <div>
          <div className="text-center text-6xl font-extrabold text-slate-50 text-shadow-black text-shadow-2xs">
            Pocket<span className="text-pink-700">URL</span>
          </div>
          <InputBar />
          <h3 className="text-slate-50 font-bold text-5xl mt-16 ml-4 xl:mt-30">No point in <br/> <span className="text-pink-700 text-shadow-sm">remembering</span> <br/> URLs any longer</h3>
        </div>
          <Button className="bg-pink-700">SEE DASHBOARD</Button>
      </div>
    </div>
  );
}
