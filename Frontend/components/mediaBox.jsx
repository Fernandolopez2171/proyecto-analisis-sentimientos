import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faXTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

function MediaBox({ icon, handleMediaSelect }) {
  return (
    <div className="rounded-xl border-2 border-zinc-700 flex items-center p-4 w-full h-24 hover:bg-zinc-700 cursor-pointer"
    onClick={() => handleMediaSelect(icon)}
    >
      <FontAwesomeIcon
        icon={
          icon === "youtube"
            ? faYoutube
            : icon === "x"
            ? faXTwitter
            : icon === "facebook"
            ? faFacebook
            : ""
        }
        className={
          "text-3xl mr-2 " +
          (icon === "youtube"
            ? "text-red-600"
            : icon === "x"
            ? "text-blue-800"
            : icon === "facebook"
            ? "text-blue-500"
            : "")
        }
      />
      <div className="align-self-end mr-auto">
        <h2>
          {icon === "youtube"
            ? "Youtube"
            : icon === "x"
            ? "X - Twitter"
            : icon === "facebook"
            ? "Facebook"
            : ""}
        </h2>
        <p className="text-gray-400 text-sm">
          {icon === "youtube"
            ? "Get comments from a Youtube video and analyze the sentiments expressed by the users"
            : icon === "x"
            ? "Analyze the comments of a tweet on X"
            : icon === "facebook"
            ? "Analyze the comments from a Facebook Post"
            : ""}
        </p>
      </div>
      <Tooltip
        placement="top"
        title={<p className="text-base">Click to Send</p>}
      >
        <FontAwesomeIcon
          icon={faArrowUp}
          className="rounded-md p-2 bg-zinc-800"
        />
      </Tooltip>
    </div>
  );
}

export default MediaBox;
