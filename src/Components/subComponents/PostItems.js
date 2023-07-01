import React, { useState } from "react";
import "../../Assets/Styles/postItem.css";
import { db } from "../../Firebase";
import { getDate, isTimeDifferenceFiveMinutes } from "../../Utils/constant";
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
import { useSelector } from "react-redux";

const PostItems = (props) => {
  const { post } = props;
  const userData = useSelector((state) => state.userData);
  const [commentContainer, setCommentContainer] = useState(false);
  const [comments, setComments] = useState([]);

  let Mydate = "T";
  const date = post?.date?.seconds ? new Date(post.date.seconds * 1000) : null;
  const formattedTime = date ? date.toLocaleTimeString() : null;
  const timeDifference = isTimeDifferenceFiveMinutes(post);
  console.log(timeDifference)
  let d = getDate(post.date.seconds);
  if (d != Mydate) Mydate = d;

  const openComment = () => {
    setCommentContainer(!commentContainer);
    const arr = [];
    post.comments.forEach((comment) => {
      arr.push(comment.text);
    });
    setComments(arr);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    console.log(e.target.comment.value);

    const q = query(
      collection(db, "Posts"),
      where("postUid", "==", post.postUid)
    );
    const postsData = await getDocs(q);
    const date = new Date();

    const commentData = {
      text: e.target.comment.value,
      userUid: userData.uid,
      date: date,
    };

    postsData.docs.forEach((doc) => {
      if (post.postUid === doc.data().postUid) {
        const commentsArray = doc.data().comments || [];
        commentsArray.push(commentData);

        updateDoc(doc.ref, { comments: commentsArray });
      }
    });
  };

  return (
    <div className="postItems">
      <div className="postDetail">
        <img src={require("../../Assets/Images/profile.png")} />

        <div>
          <div>
            <p>{post.name}</p>
            {Mydate !== d ? "" : <p className="postTime">{d}</p>}
          </div>

          <div>{timeDifference && <p>New</p>}</div>
        </div>
      </div>

      <img className="uploadedImage" src={post.imgUrl} alt="uploadedPhoto" />
      <p className="postText">{post.text}</p>
      <div className="postButtonSectiom">
        <button>
          <i class="fa-solid fa-thumbs-up"></i>&nbsp;Like
        </button>

        <button onClick={openComment}>
          <i class="fa-solid fa-comment"></i>&nbsp;Comment
        </button>
      </div>
      {commentContainer && (
        <div className="commentSection">
          {comments?.length === 0 ? (
            <p>No comments yet!</p>
          ) : (
            <>
              <div className="commentSectionContainer">
                {comments.map((comment) => (
                  <p>{comment}</p>
                ))}
              </div>
            </>
          )}
          <form onSubmit={handleComment}>
            <input name="comment" type="text" placeholder="Add Comment" />
          </form>
        </div>
      )}
    </div>
  );
};

export default PostItems;
