import React, { useEffect, useState } from "react";
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
  deleteDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const PostItems = (props) => {
  const { post } = props;

  const userData = useSelector((state) => state.userData);

  const [commentContainer, setCommentContainer] = useState(false);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [liked1, setLiked1] = useState(false);

  useEffect(() => {
    if(userData?.uid !== "") {

      const getLikes = async () => {
        const q = query(
          collection(db, "Users"),
          where("uid", "==", userData.uid)
        );
  
        const data = await getDocs(q);
        let found = false;
        data.docs.some((doc) => {
          found = doc.data().liked.some((postUid) => postUid === post.postUid);
          return found;
        });
        setLiked(found);
      };
  
      getLikes();
      console.log("/");
    }
    
  }, [post, liked1]);

  let Mydate = "T";
  const date = post?.date?.seconds ? new Date(post.date.seconds * 1000) : null;
  const formattedTime = date ? date.toLocaleTimeString() : null;
  const timeDifference = isTimeDifferenceFiveMinutes(post);
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

  const addNotification = async (uid, type, name) => {
    
      const q = query(collection(db, "Users"), where("uid", "==", uid));

      const notificationData = {
        uid,
        type,
        name,
      };

      const userData = await getDocs(q);
      userData.docs.forEach((doc) => {
        const notificationArray = doc.data().notification || [];
        notificationArray.push(notificationData);
        updateDoc(doc.ref, { notification: notificationArray });
      });
    
  };

  const addLike = async () => {
    const q = query(collection(db, "Users"), where("uid", "==", userData.uid));
    const usersdata = await getDocs(q);

    usersdata.docs.forEach((doc) => {
      const likedPosts = doc.data().liked || [];
      const found = likedPosts.some((postUid) => postUid === post.postUid);

      if (!found) {
        likedPosts.push(post.postUid);
        addNotification(post.userUid, "like", userData.name);
      } else {
        const updatedLikedPosts = likedPosts.filter(
          (postUid) => postUid !== post.postUid
        );
        // Assign the updated likedPosts array to likedPosts variable
        likedPosts.length = 0;
        likedPosts.push(...updatedLikedPosts);
      }
      updateDoc(doc.ref, { liked: likedPosts });
    });
    setLiked1(!liked1);
  };

  const handleComment = async (e) => {
    e.preventDefault();

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

    let uid = "";

    postsData.docs.forEach((doc) => {
      if (post.postUid === doc.data().postUid) {
        uid = doc.data().userUid;
        const commentsArray = doc.data().comments || [];
        commentsArray.push(commentData);

        updateDoc(doc.ref, { comments: commentsArray });
      }
    });

    addNotification(uid, "comment", userData.name);
    e.target.comment.value = "";
    openComment();
  };

  const handleDelete = async () => {
    const q = query(
      collection(db, "Posts"),
      where("postUid", "==", post.postUid)
    );

    const postsData = await getDocs(q);

    postsData.docs.forEach((doc) => {
      if (post.postUid === doc.data().postUid) {
        const docRef = doc.ref;
        deleteDoc(docRef);
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
        {liked ? (
          <button onClick={addLike} style={{ color: "#238CFF" }}>
            <i class="fa-solid fa-thumbs-up"></i>&nbsp;Liked
          </button>
        ) : (
          <button onClick={addLike}>
            <i class="fa-solid fa-thumbs-up"></i>&nbsp;Like
          </button>
        )}
        <button onClick={openComment}>
          <i class="fa-solid fa-comment"></i>&nbsp;Comment
        </button>

        {post?.userUid === userData?.uid && (
          <button onClick={handleDelete} className="deletePost">
            <i class="fa-solid fa-trash"></i>&nbsp;Delete
          </button>
        )}
      </div>
      {commentContainer && (
        <div className="commentSection">
          {comments?.length === 0 ? (
            <p>No comments yet!</p>
          ) : (
            <>
              <div className="commentSectionContainer">
                {comments.map((comment) => {
                  const date = post?.date?.seconds
                    ? new Date(post.date.seconds * 1000)
                    : null;
                  const formattedTime = date ? date.toLocaleTimeString() : null;
                  return (
                    <div className="commentItem">
                      <img
                        src={require("../../Assets/Images/456327.avif")}
                        alt="#"
                      />

                      <div>
                        <p>{comment}</p>
                        <p style={{ fontSize: "12px" }}>
                          {getDate(date)} {formattedTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
