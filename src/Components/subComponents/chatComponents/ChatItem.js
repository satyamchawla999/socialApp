import React from "react";
import "../../../Assets/Styles/chatItem.css";

const ChatItem = (props) => {
  const { user, handleOpenChat } = props;
  return (
    <div className="chatUsers" onClick={() => handleOpenChat(user)}>
      <img src={require("../../../Assets/Images/456327.avif")} />
      <p>{user.name}</p>
      {user.online === true ? (
        <p
          style={{ color: "green" }}
          className="online"
        >
          <i class="fa-solid fa-circle"></i>
        </p>
      ) : (
        <p className="online"><i class="fa-solid fa-circle"></i></p>
      )}
    </div>
  );
};

export default ChatItem;
