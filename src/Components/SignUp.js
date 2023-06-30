import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { signInWithGoogle, registerWithEmailAndPassword } from "../Firebase/auth";
import { setUser, setUserData } from "../Features/Social/userSlice"
import {Loading} from "./subComponents"
import "../Assets/Styles/signUp.scss";

const SignUp = () => {

  const input = useRef(null)

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  console.log("signUp")

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

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "" || password === "") {
      alert("Enter All Credintials");
      return;
    }

    try {
      const data = await registerWithEmailAndPassword(name,email, password);
      if(data) {
        dispatch(setUserData(data));
        dispatch(setUser());
        Navigate("/");
      }

      e.target.name.value = "";
      e.target.email.value = "";
      e.target.password.value = "";
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  if(loading) {
    <Loading/>
  }

  return (
    <div className='signUp'>
      <div className='container'>
        <div className='leftContainer'>
          <div className='formSection'>
            <div className='logo'>

            </div>

            <h1>Sign Up</h1>

            <button className='authButton' onClick={authButton}>
              <img src={require("../Assets/Images/google.png")} />
              Sign Up With Google
            </button>

            <p>OR SIGNUP WITH EMAIL</p>

            <form onSubmit={handleSubmit}>

              <label>name</label>
              <input
                type='text'
                name='name'
                placeholder='Name'
                ref={input}
              />

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
              <button>Sign Up</button>
            </form>

            <p className='p'>Already have an account <Link className='Link' to="/"><span>Sign In?</span></Link></p>
          </div>
        </div>

        <div className='rightContainer'>
          <img src={require("../Assets/Images/man.png")} />
        </div>
      </div>

    </div>
  )
}

export default SignUp;