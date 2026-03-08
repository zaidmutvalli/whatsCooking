import "../index.css";
import "../styles/nav-bar.css";

import {Link, useNavigate} from "react-router-dom";
import chefImage from "../assets/chefLogo.webp";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";

function NavBar(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('JoshA_380');
    const GoToUserSettings = () => {
    navigate('/user-settings'); 
};

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

     useEffect(() => {
        const handleStorageChange = () => {
            const savedUsername = localStorage.getItem('username');
            if (savedUsername) {
                setUsername(savedUsername);
            }
        };
          window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

 /* Chen to do: Add an onclick to JoshA_380 to navigate to the page user settings*/ 
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
            <div className="profile" onClick={GoToUserSettings} style={{ cursor: 'pointer' }}>
                <icon><CgProfile /></icon>
                <p>{username}</p>   
            </div>
            </div>
        </nav>
    )
}

export default NavBar;
