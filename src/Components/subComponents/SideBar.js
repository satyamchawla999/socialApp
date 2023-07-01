import React from "react";
import {logout} from "../../Firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserData } from "../../Features/Social/userSlice"

const SideBar = (props) => {
  const userData = useSelector((state) => state.userData);
  const { user } = props;

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const logOut = async ()=>{
    let res = await logout(userData.uid);
    dispatch(setUser());
    dispatch(setUserData({}));
    Navigate("/");
  }

  return (
    <div className="sideBar">
      <div className="backImg">
        <img src={require("../../Assets/Images/backImg.jpg")} />
        <div className="userInfo">
          <img src={require("../../Assets/Images/profile.png")} />
          <div>
            <p style={{ fontSize: "15px" }}>{userData?.name}</p>
            <p>@{userData?.name}20</p>
          </div>
        </div>
      </div>

      <div class="notifications">
        <div className="icon">
          <p className="bell">
            <i class="fa-solid fa-bell"></i>{" "}
          </p>
          <p>Notifications</p>
        </div>

        <div className="nottyContainer">

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
