import React from 'react';
import SignUp from "../Components/signUp";
import chefLogo from '../assets/chefLogo.webp';

import "../styles/signUpPage.css";

export default function SignUpPage() {

  return (
    <div className="auth-page">
      <div className="auth-branding">
        <img src={chefLogo} alt="WhatsCooking logo" className="auth-logo" />
        <span className="auth-brand-name">WhatsCooking</span>
      </div>
      <div id="wrapper">
        <h2>Create Account</h2>
        <SignUp />
      </div>
    </div>
  );
}
