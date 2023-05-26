import { More, Phone, VideoCall } from "@mui/icons-material";
import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <VideoCall />
          <Phone />
          <More />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
