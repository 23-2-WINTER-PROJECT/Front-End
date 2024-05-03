import { Routes, Route } from "react-router-dom";
import Navigation from "./Navigation.js";
import Login from "../routes/Login.js";
import Mainpage from "../routes/Mainpage.js";
import Account from "../routes/Account.js";
import Mypage from "../routes/Mypage.js";

import React from "react";

function AppRouter(props) {
  return (
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/main" element={<Mainpage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
  );
}

export default AppRouter;
