import React from "react";
import bertHead from "../styles/Images/bert-pic.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ newAnalisis }) => {
  return (
    <div className="h-screen bg-zinc-900 w-2/12 border-r border-gray-500">
      <div className="flex flex-col items-center h-full px-4 py-4">
        <div className="flex items-center w-full px-4 py-3 hover:bg-zinc-800 cursor-pointer rounded-lg"
          onClick={newAnalisis}
        >
          <Image src={bertHead} alt="Vanguardia" className="size-8 rounded-full" />
          <h1 className="text-white text-sm ml-2">New analysis</h1>
          <FontAwesomeIcon icon={faPenToSquare} className="text-white text-sm ml-auto align-self-end" />
        </div>
        
      </div>
    </div>
  );
};

export default Sidebar;
