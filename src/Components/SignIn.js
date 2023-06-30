import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { signInWithGoogle, logInWithEmailAndPassword } from "../Firebase/auth";
import { setUser, setUserData } from "../Features/Social/userSlice"

import "../Assets/Styles/signIn.scss";

const SignIn = () => {

  const input = useRef(null)

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  console.log("signIn")

  const authButton = async () => {

    try {

      const data = await signInWithGoogle();
      dispatch(setUser());
      dispatch(setUserData(data));
      Navigate("/home");

    } catch (err) {

      alert(err);
      console.error(err);

    }

  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if(email === "" || password === "") {
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
            <div className='logo'>

            </div>

            <h1>Sign In</h1>

            <button className='authButton' onClick={authButton}>
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
                ref={input}
              />

              <label>Password</label>
              <input
                style={{ marginBottom: "0px" }}
                type='password'
                name='password'
                placeholder='Password'
                ref={input}
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

export default SignIn