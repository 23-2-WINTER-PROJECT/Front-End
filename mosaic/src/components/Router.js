import { Routes, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./Router.css";
import Navigation from "./Navigation.js";
import Login from "../routes/Login.js";
import Mainpage from "../routes/Mainpage.js";
import Account from "../routes/Account.js";
import Mypage from "../routes/Mypage.js";

import React from "react";

function AppRouter(props) {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key = {location.pathname}
        timeout = {5000}
        className = "page-transition"
      >
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/main" element={<Mainpage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default AppRouter;
