import React from "react";
import Login from "../Components/login";

import "../styles/loginPage.css";

export default function LoginPage(){

    return (
        <div className="wrapper">
            <h2>Welcome Back!</h2>
            <Login />
        </div>
    );

}