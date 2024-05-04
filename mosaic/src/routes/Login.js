import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import logo from '../image/logo.png';


const Login = () => {
  const navigate = useNavigate();
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const loginURL =
    "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/login";

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "emailID") setEmailID(value);
    else if (name === "password") setPassword(value);
    setIsCorrect(true);
  };

  const loginto = async (e) => {
    e.preventDefault();
    if (!emailID || !password) {
      setIsCorrect(false);
      return;
    }

    try {
      const formData = {
        id: emailID,
        pw: password,
      };

      const response = await axios.post(loginURL, formData);
      if (response.data === true) {
        navigate("/main");
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setIsCorrect(false);
    }
  };

  return (
    <div className="L-background">
      <div classNmae = "container"> 
        <div className = "row">
          <div className = "col logo-img">
            <div className = "title-div">
              <Link to="/"
                style={{ textDecoration: "none" }}
                className="L-Title-text"
              >
              {" "}
              <img src = {logo} width = "60%"/>
              <br/>
              Mos-<span className="L-highlighted-text">AI</span>c
              </Link>
              {/* <p className = "Text">시작해보세요</p> */}
            </div>
          </div>
          <div className = "col main-div">
            <div className = "login-div">
              <div className="L-rectangle">
                <p className = "login-Title">로그인 하기</p>
                <p className = "login-detail">Mos-AIc로 여러분의 개인정보를 보호하세요.</p>
                <form onSubmit={loginto}>
                  <input
                    name="emailID"
                    type="text"
                    className="L-email-box"
                    placeholder="ID"
                    required
                    value={emailID}
                    onChange={onChange}
                  />{" "}
                  <input
                    name="password"
                    type="password"
                    className="L-password-box"
                    placeholder="password"
                    required
                    value={password}
                    onChange={onChange}
                  />
                  <br />
                  <Link
                    to="/account"
                    style={{ textDecoration: "none" }}
                    className="L-to-password-Button"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                  <br/>
                  <button className="L-login-Button">로그인</button>
                  {!isCorrect && (
                    <p className="L-noneCorrect">
                      ID 또는 비밀번호가 맞지 않습니다.
                    </p>
                  )}
                </form>
                <p className="L-login-text">
                  사이트 이용이 처음이라면?
                  <Link
                    to="/account"
                    style={{ textDecoration: "none" }}
                    className="L-to-account-Button"
                  >
                    회원가입
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;