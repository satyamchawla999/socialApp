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
  const [userData, setUserData] = useState(
    useSelector((state) => state.userData)
  );
  const Navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!userData) Navigate("/");
    let usersD = [];
    const getUsers = async () => {
      const data = query(collection(db, "Users"));
      const unsubscribe = onSnapshot(data, (snapshot) => {
        snapshot.forEach((doc) => {
          if (userData?.uid === doc.data().uid) {
            setUserData(doc.data());
            console.log("userData", userData);
          }
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
    if (!userData) Navigate("/");
    let postsD = [];
    const getPosts = async () => {
      const data = query(collection(db, "Posts"));
      const unsubscribe = onSnapshot(data, (snapshot) => {
        snapshot.forEach((doc) => {
          postsD.push(doc.data());
        });
        setPosts(postsD);
        postsD = [];
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
        (user) => user.uid === userData.uid && <SideBar user={user} />
      )}

      <Post posts={posts} users={users} />

      <div className="chatSection">
        
        <Chat users={users} />
      </div>
    </div>
  );
};

export default Home;
