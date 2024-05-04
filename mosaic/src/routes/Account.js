// Account.js
import React, { useState } from "react";
import axios from "axios";
import "./Account.css";
import "./Login.css";
import { Link, useNavigate, useLocation, Routes, Route } from "react-router-dom";
import Navigation from "../components/Navigation";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import logo from '../image/logo.png';
import { idDuplicateCheck, signup } from "../components/authService.js";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


function Account() {
    const location = useLocation();
    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                timeout={5000}
                classNames="page-transition"
            >
            <div>
                <Background />
            </div>
            </CSSTransition>
        </TransitionGroup>
    );
}

const Background = () => (
    <div className="A-background">
        <MakeAccount />
    </div>
);

const MakeAccount = () => {
    const [id, setID] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [idError, setIdError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const [isIdCheck, setIsIdCheck] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const navigate = useNavigate();

    const onChangeIdHandler = async (e) => {
    // idCheckHandler의 호출을 비동기로 변경
        const idValue = e.target.value;
        setID(idValue);
        await idCheckHandler(idValue); // idCheckHandler 함수를 비동기로 호출하고 결과를 기다림
    };

    const onChangePasswordHandler = (e) => {
        const { name, value } = e.target;
        if (name === "password") {
            setPassword(value);
            passwordCheckHandler(value, confirm);
        } else {
        setConfirm(value);
        passwordCheckHandler(password, value);
    }
    };

    const idCheckHandler = async (id) => {
        if (id === "") {
            setIdError("아이디를 입력해주세요.");
            setIsIdAvailable(false);
            return false;
        }
        try {
            const responseData = await idDuplicateCheck(id);
            if (responseData.result === true) {
                setIdError("이미 사용중인 아이디입니다.");
                setIsIdAvailable(false);
            return false;
            }else {
                setIdError("사용 가능한 아이디입니다.");
                setIsIdAvailable(true);
                return true;
            }
        } catch (error) {
            alert("서버 오류입니다. 관리자에게 문의하세요.");
            console.error(error);
            return false;
        }
    };

    const passwordCheckHandler = (password, confirm) => {
        if (password === "") {
            setPasswordError("비밀번호를 입력해주세요.");
            return false;
        } else if (confirm !== password) {
            setPasswordError("");
            setConfirmError("비밀번호가 일치하지 않습니다.");
            return false;
        } else {
            setPasswordError("");
            setConfirmError("");
            return true;
        }
    };

    const signupHandler = async (e) => {
        e.preventDefault();

        const idCheckresult = await idCheckHandler(id);
        if (idCheckresult !== false) {
            setIdError("");
        } else {
            return;
        }

        const passwordCheckResult = passwordCheckHandler(password, confirm);
            if (passwordCheckResult !== false) {
                setPasswordError("");
                setConfirmError("");
            } else {
                return;
            }

    try {
        const responseData = await signup(id, password);
        if (responseData) {
            localStorage.setItem("loginId", id);
            navigate("/login"); // 회원가입이 완료되면 '/login'으로 이동
        } else {
            alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        }
    } catch (error) {
        alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        console.error(error);
    }
};

    return (
        <div className = "L-background">
            <div className = "container">
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
                        </div>
                    </div>
                    <div className = "col main-div">
                        <div className = "login-div">
                            <div className="A-rectangle">
                                <p className="A-account-title">회원가입 하기</p>
                                <p className = "login-detail">Mos-AIc로 당신의 개인정보를 보호하세요.</p>
                                <form onSubmit={signupHandler}>
                                    <input
                                        className="A-email-box"
                                        onChange={onChangeIdHandler}
                                        type="text"
                                        id="id"
                                        name="id"
                                        value={id}
                                        maxLength={10}
                                        placeholder="ID"
                                    />
                                    {idError && (
                                        <small className={isIdAvailable ? "idAvailable" : "idAvailable"}>
                                        {idError}
                                        </small>
                                    )}{" "}
                                    <input
                                        className="A-password-box"
                                        onChange={onChangePasswordHandler}
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        maxLength={16}
                                        placeholder="PW"
                                    />
                                    <input
                                        className="A-password-box"
                                        onChange={onChangePasswordHandler}
                                        type="password"
                                        id="confirm"
                                        name="confirm"
                                        value={confirm}
                                        maxLength={16}
                                        placeholder="PW again"
                                    />
                                    {confirmError && (
                                        <small className="idAvailable">{confirmError}</small>
                                    )}{" "}
                                    <br />
                                    <button type="submit" className="A-account-Button">
                                        회원가입
                                    </button>
                                </form>
                                <p className="L-login-text">
                                    이미 계정이 있으신가요?
                                    <Link
                                        to="/login"
                                        style={{ textDecoration: "none" }}
                                        className="L-to-account-Button"
                                    >
                                        로그인
                                    </Link>
                                </p>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;