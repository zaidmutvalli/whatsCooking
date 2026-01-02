import "../index.css";
import "../styles/nav-bar.css";

import {Link} from "react-router-dom";
import chefImage from "../assets/chefLogo.webp";
import { CgProfile } from "react-icons/cg";

function NavBar(){

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
                <icon><CgProfile /></icon>
                <p>JoshA_380</p>
            </div>
            </div>
        </nav>
    )
}

export default NavBar;
