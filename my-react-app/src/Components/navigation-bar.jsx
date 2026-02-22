import "../index.css";
import "../styles/nav-bar.css";

import {Link} from "react-router-dom";
import chefImage from "../assets/chefLogo.webp";
import { CgProfile } from "react-icons/cg";

import{useState,useEffect} from 'react';


function NavBar(){

    const [user,setUser]=useState(null);

    useEffect(()=>{

        fetch("http://localhost:8888/get_user_info.php",{
            credentials:'include'
        })

        .then(res => res.json())
        .then(data => {
            if (data.status === "success"){
                setUser(data.user)
            }
        });

    },[]);

    return(
        <nav className="navBar">
            <div className="leftSection">
           <img src={chefImage} alt="Chef Logo" className="chefLogo"/>
            <h1>WhatsCooking</h1>
            </div>
            <div className="rightSection">
            <ul className="menu">
                <li>Places</li>
                <li>Social</li>
                <li>Trending</li>
            </ul>
            <div className="profile">
               <CgProfile />
                {user ? <span>{user.username}</span> : <Link to='/logIn'>Sign In</Link>}
            </div>
            </div>
        </nav>
    )
}

export default NavBar;
