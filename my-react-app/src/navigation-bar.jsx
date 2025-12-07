import "./index.css";
import chefImage from "./assets/chefLogo.webp";

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
            </div>
        </nav>
    )
}

export default NavBar;
