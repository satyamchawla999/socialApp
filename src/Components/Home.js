import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Post, SideBar } from "./subComponents";
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
  const userData = useSelector((state) => state.userData);
  const Navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!userData) Navigate("/");

    const fetchData = async () => {
      const usersQuery = query(collection(db, "Users"));
      const postsQuery = query(collection(db, "Posts"));

      const [usersData, postsData] = await Promise.all([
        getDocs(usersQuery),
        getDocs(postsQuery),
      ]);

      const users = usersData.docs.map((user) => user.data());
      const posts = postsData.docs.map((post) => post.data());

      setUsers(users);
      setPosts(posts);
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {users.map(
        (user) => user.uid === userData.uid && <SideBar user={user} />
      )}

      <Post posts={posts} />
    </div>
  );
};

export default Home;
