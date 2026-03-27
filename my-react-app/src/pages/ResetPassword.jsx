import React from 'react';
import ResetPassword from '../Components/resetPassword';
import chefLogo from '../assets/chefLogo.webp';

import "../styles/resetPassword.css";

export default function ResetPasswordPage() {

  return (
    <div className="auth-page">
      <div className="auth-branding">
        <img src={chefLogo} alt="WhatsCooking logo" className="auth-logo" />
        <span className="auth-brand-name">WhatsCooking</span>
      </div>
      <div id="wrapper">
        <h2>Recover Your Password</h2>
        <ResetPassword />
      </div>
    </div>
  );

}
