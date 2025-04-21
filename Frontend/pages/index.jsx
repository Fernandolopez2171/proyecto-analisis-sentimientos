import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCircle,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

// Services
import PromptService from "../Services/prompt-service";

// Images
import imageBert from "../styles/Images/bert-pic.png";
import bertHead from "../styles/Images/BertHead.png";

//Components
import Sidebar from "../components/sidebar";
import Image from "next/image";
import MediaBox from "../components/mediaBox";
import GraphicView from "../components/graphicView";

const TypingEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (text) {
        const timer = setTimeout(() => {
            setDisplayText(text.substring(0, index));
            setIndex(index + 1);
        }, 20);

        return () => clearTimeout(timer);
    }
}, [index, text]);

  return <p>{displayText}</p>;
};

export default function Home() {
  const [prompted, setPrompted] = useState(false);
  const [currentChat, setCurrentChat] = useState("");
  const [currentId, setCurrentId] = useState(null)
  const [chats, setChats] = useState({
    id: [],
    message: [],
    user: [],
    links: [],
  });
  const [waitMedia, setWaitMedia] = useState({
    youtube: false,
    x: false,
  });
  const [modalView, setModalView] = useState({
    graphicView: false,
  });
  const [graphicInfo, setGraphicInfo] = useState({
    percentage: null,
    count: null,
    requested: false,
  });

  const handleActivePrompt = (e) => {
    const newChat = e.target.value;
    newChat === "" ? setPrompted(false) : setPrompted(true);
    setCurrentChat(newChat);
  };

  const handleSendPrompt = async () => {
    let oldChats = [];
    let oldUsers = [];
    let oldLinks = [];

    oldChats = chats.message;
    oldLinks = chats.links;
    if (oldChats === undefined) {
      oldChats = [];
    }
    if (oldLinks === undefined) {
      oldLinks = [];
    }
    if (oldUsers === undefined){
      oldUsers = [];
    }
    setCurrentChat("")
    setPrompted(false);
    let currentC = currentChat;
    oldChats.push(currentC);
    oldLinks.push(false);

    let newData = "";
    if (currentC.includes("youtube.com") && waitMedia.youtube) {
      newData = await PromptService.analyseYoutubeVideo(currentC);
      oldChats.push(newData.text);
      oldLinks.push(true);
      setGraphicInfo({
        percentage: {
          positive: newData.bertResponse.positive,
          negative: newData.bertResponse.negative,
          neutral: newData.bertResponse.neutral
        },
        count: {
          positive_count: newData.bertResponse.positive_count,
          negative_count: newData.bertResponse.negative_count,
          neutral_count: newData.bertResponse.neutral_count
        },
        requested: true,
      });
    } else if (currentC.includes("twitter.com") && waitMedia.x) {
      newData = await PromptService.analyseTwitter(currentC);
      oldChats.push(newData);
      oldLinks.push(true);
    } else {
      newData = await PromptService.getAnalisis(currentC);
      oldLinks.push(false);
      if (oldChats.length === 1) {
        oldChats.push("Hello, " + newData.text);
      } else {
        oldChats.push(newData.text);
      }
    }

    oldUsers = chats.user;
    oldUsers.push(2);
    oldUsers.push(1);

    if (oldChats != "") {
      setChats({
        message: oldChats,
        user: oldUsers,
        links: oldLinks,
      });
      setCurrentChat("");
    }
  };

  const newAnalisis = () => {
    setChats({
      message: [],
      user: [],
    });
    setPrompted(false);
    setCurrentChat("");
  };

  const handleMediaSelect = (media) => {
    let oldChats = [];
    let oldUsers = [];
    let oldLinks = [];

    oldChats = chats.message;
    oldLinks = chats.links;
    if (oldChats === undefined) {
      oldChats = [];
    }
    if (oldLinks === undefined) {
      oldLinks = [];
    }
    if (oldUsers === undefined){
      oldUsers = [];
    }
    if (media === "youtube") {
      oldChats.push(
        "Hello, provide the link to video you wish to analyse the comments."
      );
      setWaitMedia({
        youtube: true,
        x: false,
      });
    } else if (media === "x") {
      oldChats.push(
        "Hello, provide the link to tweet you wish to analyse the comments."
      );
      setWaitMedia({
        youtube: false,
        x: true,
      });
    }
    oldUsers = chats.user;
    oldUsers.push(1);
    oldLinks.push(false);
    setChats({
      links: oldLinks,
      message: oldChats,
      user: oldUsers,
    });
  };

  return (
    <>
      <Helmet>
        <title>BertAS</title>
        <meta name="description" content="Proyecto Vanguardia | Inicio" />
      </Helmet>
      <div className="flex w-full h-full">
        {modalView.graphicView && (
          <GraphicView
            openModal={() => {
              setModalView({ graphicView: false });
            }}
            percentage={graphicInfo.percentage}
            count={graphicInfo.count}
          />
        )}
        <Sidebar newAnalisis={newAnalisis} />
        <div className="flex flex-col h-full w-10/12 items-center bg-zinc-800 pt-12 pb-6 px-24">
          <div className="mb-8">
            <h1
              className={
                "text-5xl font-sans " +
                (chats.message.length === 0 ? " animate-pulse infinite" : "")
              }
            >
              Sentiment Analysis
            </h1>
          </div>
          {chats.message.length > 0 ? (
            <div className="w-2/3 h-full space-y-6 mb-4 overflow-auto">
              {chats.message.map((item, index) => (
                <div className="flex items-start space-x-4" key={index}>
                  {chats.user[index] === 1 ? (
                    <Image
                      src={imageBert}
                      className="size-9 rounded-full"
                      alt=""
                    />
                  ) : (
                    <FontAwesomeIcon icon={faCircleUser} className="size-9" />
                  )}
                  <div>
                    <p className="text-xl">
                      {chats.user[index] === 1 ? "BertAS" : "You"}
                    </p>
                    {chats.user[index] === 1 ? (
                      <>
                        <TypingEffect text={item} />
                        {graphicInfo.requested && chats.links[index] && (
                          <p
                            className="hover:text-zinc-400 cursor-pointer underline mt-3"
                            onClick={() => {
                              setModalView({ ...modalView, graphicView: true });
                            }}
                          >
                            View graphic
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text font-extralight text-red">{item}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center h-full">
              <Image src={bertHead} alt="BERT" className="mb-4 w-auto h-52" />
              <span className="text-xl font-bold font-sans">
                How can I help you today?
              </span>
              <div className="w-2/3 h-full flex space-x-4 items-end mt-5">
                <MediaBox
                  icon="youtube"
                  handleMediaSelect={handleMediaSelect}
                />
              </div>
            </div>
          )}
          <div className="h-16 border-2 border-zinc-700 w-2/3 align-bottom rounded-xl flex items-center px-4 mt-4 space-x-2">
            <input
              onChange={(e) => {
                handleActivePrompt(e);
              }}
              value={currentChat}
              className="w-full h-fit text-white text-base bg-transparent border-none outline-none overflow-y-auto overflow-x-hidden"
              placeholder="Message BertAS"
            />
            <Tooltip
              placement="top"
              title={<p className="text-base">Click to send</p>}
            >
              <FontAwesomeIcon
                className={
                  "p-1 rounded-md size-4 text-sm justify-self-end ml-auto " +
                  (prompted
                    ? "bg-white text-zinc-500 cursor-pointer"
                    : "bg-zinc-700 text-zinc-800")
                }
                onClick={() => {
                  (prompted ? handleSendPrompt():"")
                }}
                icon={faArrowUp}
              />
            </Tooltip>
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            BertAS can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </>
  );
}
