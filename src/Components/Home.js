import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Post, SideBar, Chat } from "./subComponents";
import "../Assets/Styles/home.scss";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase";
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

const Home = () => {
  console.log("home")
  const userData  = 
    useSelector((state) => state.userData)
  
  const Navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userData === {}) Navigate("/");
    let usersD = [];
    const getUsers = async () => {
      const data = query(collection(db, "Users"));
      const unsubscribe = onSnapshot(data, (snapshot) => {
        snapshot.forEach((doc) => {
          // if (userData?.uid === doc.data().uid) {
          //   setUserData(doc.data());
          //   console.log("userData", userData);
          // }
          usersD.push(doc.data());
        });
        setUsers(usersD);
        usersD = [];
      });
      return () => unsubscribe();
    };
    getUsers();
  }, []);

  useEffect(() => {
    if (userData === {}) Navigate("/");
    const getPosts = async () => {
      const data = query(collection(db, "Posts"));
      const unsubscribe = onSnapshot(data, (snapshot) => {
        const postsD = [];
        snapshot.forEach((doc) => {
          postsD.push(doc.data());
        });
        const sortedPosts = postsD.reverse();
        setPosts(sortedPosts);
      });
      return () => unsubscribe();
    };
    getPosts();
  }, []);
  
  // useEffect(() => {
  //   if (!userData) Navigate("/");

  //   const fetchData = async () => {
  //     const usersQuery = query(collection(db, "Users"));
  //     const postsQuery = query(collection(db, "Posts"));

  //     const [usersData, postsData] = await Promise.all([
  //       getDocs(usersQuery),
  //       getDocs(postsQuery),
  //     ]);

  //     const users = usersData.docs.map((user) => user.data());
  //     const posts = postsData.docs.map((post) => post.data());

  //     setUsers(users);
  //     setPosts(posts);
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="home">
      {users.map(
        (user,index) => user.uid === userData.uid && <SideBar key={index} user={user} />
      )}

      <Post posts={posts} users={users} />

      <div className="chatSection">
        
        <Chat users={users} />
      </div>
    </div>
  );
};

export default Home;
