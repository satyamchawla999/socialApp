import React, { useRef, useState, useCallback } from "react";
import { storage, db } from "../../Firebase";
import {PostUpload,PostItems} from "./";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "../../Assets/Styles/posts.css";
import { useSelector } from "react-redux";

import {
  getFirestore,
  doc,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const Post = React.memo((props) => {
  const {posts} = props;
  console.log("post");

  return (
    <div className="posts">
      {/* {!imgUrl && (
        <div className="outerbar">
          <div className="innerbar" style={{ width: `${progresspercent}%` }}>
            {progresspercent}%
          </div>
        </div>
      )}
      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />} */}

      {/* {imgUrl && (
        <video src={imgUrl} controls width={400} height={300}>
          Your browser does not support the video tag.
        </video>
      )} */}

      <div className="postContainer">
        {posts?.map((post)=>(<PostItems key={post.postUid} post={post}/>))}
      </div>

      <PostUpload/>
    </div>
  );
});

export default Post;
