import { Timestamp } from "firebase/firestore";
import { format, isTomorrow, isToday } from "date-fns";
import {getDate} from "../../..//Utils/constant"

const ChatRoom = (props) => {
  const { chats, userId, userDataId } = props;

  return (
    <div className="chatMain">
      <div className="chatRoom">
        {chats.map((chat, index) => {
          let Mydate = "T";
          const date = chat?.date?.seconds
            ? new Date(chat.date.seconds * 1000)
            : null;
          const formattedTime = date ? date.toLocaleTimeString() : null;
          let d = getDate(chat.date.seconds);
          if (d != Mydate && index != 0) Mydate = d;

          return (
            <div key={index} className="messageDate">
              {Mydate === d ? "" : <p className="chatRoomDate">{d}</p>}

              <div>
                {chat.senderId === userDataId ? (
                  <div className="rightMessage">
                    <p>{chat.text}</p>
                    {formattedTime && (
                      <span>
                        {formattedTime}&nbsp;
                        {chat.status === true ? (
                          <>
                            <i
                              style={{ color: "blue" }}
                              className="fa-solid fa-check-double"
                            ></i>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-check-double"></i>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="leftMessage">
                    <p>{chat.text}</p>
                    {formattedTime && <span>{formattedTime}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatRoom;
