import { Container, Nav, Navbar } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Navigation.css';

const Navigation = () => {
    const navigation = useNavigate();
    return(
        <div>
            <Navbar className="Navbar">
                <Container>
                    <Navbar.Brand href="/">
                        <p className="NavTitle">
                            Mos-<span className="highlighted-text">AI</span>c
                        </p>
                    </Navbar.Brand>
                    <Nav>
                        <Nav.Link href = "/invert" style = {{ textDecoration : "none"}} className="invertButton" >
                            Invert
                        </Nav.Link>
                        <Nav.Link href = "/login" style = {{ textDecoration : "none" }} className="loginButton">
                            Login
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default Navigation;