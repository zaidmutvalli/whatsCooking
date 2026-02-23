import "../index.css";
import "../styles/nav-bar.css";

import { Link, useNavigate } from "react-router-dom";
import chefImage from "../assets/chefLogo.webp";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from 'react';

function NavBar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8888/get_user_info.php", {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                setUser(data.user);
            }
        });
    }, []);

    return (
        <nav className="navBar">
            <div className="leftSection">
                <img src={chefImage} alt="Chef Logo" className="chefLogo" />
                <Link to="/" className="nav-brand"><h1>WhatsCooking</h1></Link>
            </div>
            <div className="rightSection">
                <ul className="menu">
                    <li>
                        <Link to="/places" className="nav-link">Places</Link>
                    </li>
                    <li>
                        <Link to="/social" className="nav-link">Social</Link>
                    </li>
                    <li>
                        <Link to="/trending" className="nav-link">Trending</Link>
                    </li>
                </ul>
                <div className="profile">
                    <CgProfile />
                    {user ? <span>{user.username}</span> : <Link to='/logIn'>Sign In</Link>}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;