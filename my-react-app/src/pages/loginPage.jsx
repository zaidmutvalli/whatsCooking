import React from 'react';
import LogIn from '../Components/login';
import chefLogo from '../assets/chefLogo.webp';

import '../styles/loginPage.css';

export default function LogInPage() {

  return (
    <div className="auth-page">
      <div className="auth-branding">
        <img src={chefLogo} alt="WhatsCooking logo" className="auth-logo" />
        <span className="auth-brand-name">WhatsCooking</span>
      </div>
      <div id="wrapper">
          <h2>Welcome Back</h2>
          <LogIn />
      </div>
    </div>
  );
}