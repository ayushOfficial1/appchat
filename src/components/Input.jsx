import { AttachFile, Image, Send } from "@mui/icons-material";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    const userChatRef = doc(db, "userChats", data.user.uid);
    const userChatDoc = await getDoc(userChatRef);

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
          }
        },
        (error) => {
          // Handle errors here
          // setErr(true);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(`Updating userChats document for img ${data.user.uid}`);
            console.log(
              `Updating userChats document for hello this is not showing ${currentUser.uid}`
            );
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                data: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      if (!userChatDoc.exists()) {
        alert("num1");
      }
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          data: Timestamp.now(),
        }),
      });
    }

    if (!userChatDoc.exists()) {
      alert("num2");
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // console.log(`Updating userChats document for ${data.user.uid}`);
    // console.log(`Updating userChats document for ${currentUser.uid}`);

    if (!userChatDoc.exists()) {
      alert("num3");
    }
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <AttachFile />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
        <label htmlFor="file">
          <Image />
        </label>
        <button onClick={handleSend}>
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Input;
