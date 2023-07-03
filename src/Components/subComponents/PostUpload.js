import { Modal } from "antd";
import { useSelector } from "react-redux";
import React, { useRef, useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { storage, db } from "../../Firebase";

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


const PostUpload = () => {

  const userData = useSelector((state) => state.userData);

  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

  let chooseFile = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = chooseFile.current?.files[0];
    const text = e.target.text.value;

    console.log(file.type);
    console.log(text);

    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const date = new Date();
          const postUid = Date.now();

          let vidioUrl = "";
          let imgUrl = "";

          if(file.type === "video/mp4") {
            console.log("vidio vidio vidio")
            vidioUrl = downloadURL;
            imgUrl = "";
          } else {
            vidioUrl = "";
            imgUrl = downloadURL;
          }
          const postData = {
            name: userData.name,
            userUid: userData.uid,
            postUid: postUid,
            imgUrl: imgUrl,
            vidioUrl:vidioUrl,
            text: text,
            likes: 0,
            comments: [],
            date: date,
          };

          const uploadPost = async () => {
            const q = query(
              collection(db, "Posts"),
              where("postUid", "==", postUid)
            );
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
              await addDoc(collection(db, "Posts"), postData);
            }
          };

          uploadPost();
          e.target.text.value="";
          chooseFile = null;
          setImgUrl(null);
          handleOk();
          
        });
      }
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setImgUrl(null)
    chooseFile = null
    setIsModalOpen(true);
    setProgresspercent(0);
  }
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const file = chooseFile.current?.files[0];
    file && setImgUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      <Modal
        className="modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        bodyStyle={{ height: "350px" }}
        width={700}
      >
        <div className="addPost">
          <form onSubmit={(e)=>handleSubmit(e,chooseFile)} className="form">
            <div className="postForm">
              <div className="textBar">
                <textarea
                  type="text"
                  name="text"
                  placeholder="What's on your mind?"
                  rows={20}
                  cols={42}
                />
                <button type="submit">Upload {progresspercent}%</button>
              </div>

              <div className="imgSelect">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleChange}
                  ref={chooseFile}
                />
                <label id="file-input-label" for="file-input">
                  <div className="img">
                    {imgUrl ? (
                      <img src={imgUrl} alt="uploaded file" />
                    ) : (
                      <img
                        src={require("../../Assets/Images/upload.png")}
                        style={{ padding: "100px" }}
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      <button className="addPostButton" onClick={showModal}>
        &nbsp;+&nbsp;
      </button>
    </div>
  );
};

export default PostUpload;
