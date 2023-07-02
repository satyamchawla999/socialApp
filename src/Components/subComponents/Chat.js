import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../Firebase";
import { ChatItem, OpenChat } from "./chatComponents";
import "../../Assets/Styles/chat.css";
import {
  getFirestore,
  docs,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const Chat = (props) => {
  const userData = useSelector((state) => state.userData);

  const { users } = props;
  const [chat, setChat] = useState();

  const handleOpenChat = async (user) => {
    console.log(user.uid);
    console.log(userData.uid);

    const chatId =
      user.uid > userData.uid
        ? userData.uid + user.uid
        : user.uid + userData.uid;

    const q = query(collection(db, "ChatRoom"), where("chatId", "==", chatId));
    const docs = await getDocs(q);

    const data = {
      chatId: chatId,
      chats: [],
    };

    data[user.uid] = false;
    data[userData.uid] = false;

    if (docs.docs.length === 0) {
      await addDoc(collection(db, "ChatRoom"), data);
    }

    setChat(user);
  };

  return (
    <div className="chat">
      <p>Quick Chat</p>

      <div className="containerChat">
        <div className="openChatContainer">
          {chat && <OpenChat user={chat} currentUser={userData} />}
        </div>

        <div className="chatItemContainer">
          {users.map(
            (user) =>
              user.uid !== userData.uid && (
                <ChatItem
                  key={user.uid}
                  user={user}
                  handleOpenChat={handleOpenChat}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
