import React from 'react'
import { useSelector } from 'react-redux';
import { Post } from './subComponents';
import "../Assets/Styles/home.scss"

const Home = () => {

  const userData = useSelector((state) => state.userData);
  console.log(userData)
  return (
    <div className='home'>

      <div className='sideBar'>
        <div className='backImg'>
          <div className='userInfo'>
            {/* <img src={require("../Assets/Images/profile.png")} /> */}
            <div>
              <p>{userData.name}</p>
              <p>@{userData.name}20</p>
            </div>
          </div>
        </div>
      </div>

      <Post/>

    </div>
  )
}

export default Home