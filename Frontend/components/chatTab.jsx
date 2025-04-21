import React from "reat";

const ChatTab = ({ text }) => {
  return (
    <div className="rounded-lg">
      <div className="flex items-center justify-between bg-zinc-700 rounded-t-lg px-4 py-2">
        <p className="text-white text-2xl font-bold font-sans">Chat</p>
        <div className="flex items-center">
          <button className="text-white text-lg font-bold font-sans">X</button>
        </div>
      </div>
      <div className="h-96 bg-zinc-800 rounded-b-lg"></div>
    </div>
  );
};

export default ChatTab;