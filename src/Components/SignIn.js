import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { authButton } from '../Utils/constant';
import { setUser, setUserData } from "../Features/Social/userSlice";
import { logInWithEmailAndPassword } from "../Firebase/auth";

import "../Assets/Styles/signIn.scss";

const SignIn = () => {

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) Navigate("/home")
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "" || password === "") {
      alert("Enter All Credintials");
      return;
    }

    try {
      const data = await logInWithEmailAndPassword(email, password);
      dispatch(setUserData(data));
      dispatch(setUser());
      Navigate("/home");
      e.target.email.value = "";
      e.target.password.value = "";
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  return (
    <div className='signIn'>
      <div className='container'>
        <div className='leftContainer'>
          <div className='formSection'>

            <h1>Sign In</h1>

            <button className='authButton' onClick={()=>authButton(dispatch,Navigate)}>
              <img src={require("../Assets/Images/google.png")} />
              Log In With Google
            </button>

            <p>OR LOGIN WITH EMAIL</p>

            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type='email'
                name='email'
                placeholder='Email Address'
              />

              <label>Password</label>
              <input
                style={{ marginBottom: "0px" }}
                type='password'
                name='password'
                placeholder='Password'
              />

              <p>Forgot Password?</p>
              <button>Sign In</button>
            </form>

            <p className='p'>Don't have an account <Link className='Link' to="/signup"><span>Sign Up?</span></Link></p>
          </div>
        </div>

        <div className='rightContainer'>
          <img src={require("../Assets/Images/man.png")} />
        </div>
      </div>
    </div>
  )
}

export default SignIn;