import React, { useState, useRef } from "react";
import { Modal } from "antd";
import { logout } from "../../Firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../../Features/Social/userSlice"
import { db, storage } from "../../Firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "../../Assets/Styles/sideBar.css"

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
  setDoc,
} from "firebase/firestore";

const SideBar = (props) => {

  const { user, key } = props;
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const userData = useSelector((state) => state.userData);
  
  const [imgUrl, setImgUrl] = useState(null);
  let chooseFile = useRef(null);

  const clearNotification = async () => {
    if (user.notification.length === 0)
      return;
    const q = query(
      collection(db, "Users"),
      where("uid", "==", user.uid)
    );
    const userData = await getDocs(q);
    userData.docs.forEach((doc) => {
      updateDoc(doc.ref, { notification: [] });
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = chooseFile.current?.files[0];
    let text = ""
    if(e.target.name.value !== userData.name) {
      text = e.target.name.value;
    } 

    if (!file && !text) return;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          let imgUrl = downloadURL

          const uploadProfile = async () => {
            const q = query(
              collection(db, "Users"),
              where("uid", "==", userData.uid)
            );

            let name = userData.name;
            if(text!==""){
              name = text
            }
            const data = {
              name:name,
              imgUrl:imgUrl
            }
            const docs = await getDocs(q);
            docs.docs.forEach((doc)=>{
              setDoc(doc.ref,data,{merge:true});
            })
          };

          uploadProfile();
          e.target.name.value="";
          chooseFile = null;
          setImgUrl(null);
          handleOk();
        });
      }
    );
  };

  const logOut = async () => {
    let res = await logout(userData.uid);
    dispatch(deleteUser());
    Navigate("/");
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const handleChange = (e) => {
    console.log("hello")
    const file = chooseFile.current?.files[0];
    console.log(file)
    file && setImgUrl(URL.createObjectURL(file));
  };

  return (
    <div className="sideBar">
      <div className="backImg">
        <img src={require("../../Assets/Images/backImg.jpg")} />
        <div className="userInfo" onClick={showModal} >
          <img src={user.imgUrl} />
          <div>
            <p style={{ fontSize: "15px" }}>{user?.name}</p>
            <p>@{user?.name}20</p>
          </div>
        </div>
      </div>

      <Modal
        className="modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        width={700}
      >
        <form className="profile" onSubmit={handleSubmit}>
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
                <img src={user.imgUrl} />
              )}
            </div>
          </label>

          <div className="form">

            <div>
              <label>Name</label>
              <input name="name" placeholder={user.name} />
              <label>Email</label>
              <input disabled={true} name="email" placeholder={user.email} />
            </div>

            <button>Update Profile</button>

          </div>
        </form>
      </Modal>

      <div class="notifications">
        <div className="icon">
          <p className="bell">
            <i class="fa-solid fa-bell"></i>{" "}
          </p>
          <p>Notifications</p>
          <p className="clearNotification" onClick={clearNotification}><i class="fa-regular fa-trash-can"></i></p>
        </div>

        <div className="nottyContainer">

          {user.notification.length === 0 && <p className="emptyNotification" >No notification's yet!</p>}

          {user.notification.map((n) => (
            <div className="notty">
              <img src={require("../../Assets/Images/456327.avif")}></img>
              {n.type === "like" && <p>{n.name} liked your photo</p>}
              {n.type === "comment" && <p>{n.name} commented on your photo</p>}
            </div>
          ))}

        </div>

        <div className="logout" onClick={logOut}>
          <h4><i class="fa-solid fa-right-from-bracket"></i> Log Out</h4>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
