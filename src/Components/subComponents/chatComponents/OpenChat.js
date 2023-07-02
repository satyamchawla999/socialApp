import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { db } from "../../../Firebase";
import {
  getDocs,
  query,
  collection,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import ChatRoom from "./ChatRoom";
import "../../../Assets/Styles/openChat.css";

const OpenChat = (props) => {
  const { user, currentUser } = props;
  const userData = useSelector((state) => state.userData);

  const textBox = useRef(null);

  const [send, setSend] = useState({});
  const [typing, setTyping] = useState(false);
  let updateTyping = false;

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const chatId =
        user.uid > userData.uid
          ? userData.uid + user.uid
          : user.uid + userData.uid;

      const q = query(
        collection(db, "ChatRoom"),
        where("chatId", "==", chatId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedChats = [];
        snapshot.forEach((doc) => {
          const chats = doc.data().chats;
          const cd = userData.uid;

          setTyping(doc.data()[cd]);
          console.log(cd, doc.data()[cd]);

          const updatedChat = chats.map((chat) => {
            if (chat.reciverId === userData.uid) {
              return {
                ...chat,
                status: true,
              };
            }
            return chat;
          });

          updatedChats.push(...updatedChat);
          const docRef = doc.ref;
          updateDoc(docRef, { chats: updatedChat });
        });

        setChats(updatedChats);
      });

      return () => unsubscribe();
    };

    getChats();
  }, [user, send]);

  const handleMessage = (e) => {
    e.preventDefault();

    if (textBox.current.value == "") {
      alert("empty");
      return;
    }

    const chatId =
      user.uid > userData.uid
        ? userData.uid + user.uid
        : user.uid + userData.uid;

    const date = new Date();
    console.log(date);

    const data = {
      text: textBox.current.value,
      status: false,
      senderId: userData.uid,
      reciverId: user.uid,
      id: userData.uid,
      chatId: chatId,
      date: date,
    };

    setSend(data);

    const getChat = async () => {
      const chatRoomRef = collection(db, "ChatRoom");
      const querySnapshot = await getDocs(query(chatRoomRef));

      querySnapshot.forEach((doc) => {
        if (chatId === doc.data().chatId) {
          const chatsArray = doc.data().chats || [];
          chatsArray.push(data);

          updateDoc(doc.ref, { chats: chatsArray });
        }
      });
    };

    getChat();
    e.target.textBox.value = "";
  };

  let t;
  const handleChange = async (e) => {
    clearTimeout(t);

    // setMessage(e.target.value);
    const chatId =
      user.uid > userData.uid
        ? userData.uid + user.uid
        : user.uid + userData.uid;

    const q = query(collection(db, "ChatRoom"), where("chatId", "==", chatId));
    let docs = await getDocs(q);
    if (updateTyping === false) {
      docs.forEach((doc) => {
        const obj = {};
        obj[user.uid] = true;
        const docRef = doc.ref;
        updateDoc(docRef, obj);
      });
      console.log("updateTyping");
      updateTyping = true;
    }

    t = setTimeout(() => {
      docs.forEach((doc) => {
        const obj = {};
        obj[user.uid] = false;
        const docRef = doc.ref;
        updateDoc(docRef, obj);
      });
      updateTyping = false;
      console.log("updateTypingFalse");
    }, 5000);
  };

  const handleClear = async () => {
    const chatId =
      user.uid > userData.uid
        ? userData.uid + user.uid
        : user.uid + userData.uid;

    const q = query(collection(db, "ChatRoom"), where("chatId", "==", chatId));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      const arr = [];
      const docRef = doc.ref;
      updateDoc(docRef, { chats: arr });
    });
  };

  return (
    <div className="openChat">

      <div className="openUserInfo">
        <img src={require("../../../Assets/Images/456327.avif")} alt="#" />
        <p>{user.name}</p>
        {user.online === true ? (
          <p
            style={{ color: "green" }}
            className="online"
          >
            <i class="fa-solid fa-circle"></i>
          </p>
        ) : (
          <p className="online">
            <i class="fa-solid fa-circle"></i>
          </p>
        )}
      </div>

      <div className="additionalInfo">
        <p className="typing">{typing === true && <>Typing...</>}</p>
        <p className="clear" onClick={handleClear}>
          Clear Conversation
        </p>
      </div>

      <ChatRoom chats={chats} userId={user.uid} userDataId={userData.uid} />

      <div className="openChatBar" onSubmit={handleMessage}>
        <form>
          <input
            placeholder="Type Something..."
            name="textBox"
            ref={textBox}
            onChange={handleChange}
          />
          <button onSubmit={handleMessage}>
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OpenChat;
