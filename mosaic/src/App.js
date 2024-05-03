import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Routes, Route, Link, } from "react-router-dom";

import Slider from 'react-slider';
import Login from "./routes/Login.js";
import Mainpage from "./routes/Mainpage.js";
import Account from "./routes/Account.js";
import Mypage from "./routes/Mypage.js";


import image1 from './image/image1.png';
import image2 from './image/image2.png';
import image3 from './image/image3.png';
import image4 from './image/image4.png';
import mainImage from './image/mainImage.png';

function App() {
  const [blurValue, setBlurValue] = useState(0);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLoginNavigate = () => {
    navigate('/login'); // '/login'으로 이동
  };

  return (
    <div>
      <Routes>
        <Route path = "/" element ={
    <div className="App">
      <header className="App-header">
        Mos-<span className="highlighted-text">AI</span>c
      </header>
      <main className="content">
        {/* <p className="Title">
          Mos-<span className="highlighted-text">AI</span>c
        </p> */}
        <p className="Text">
          <br/>
          <span className="im-Text">각각의 순간,</span><br/>
          <span className="bold-text">당신의 프라이버시</span>를 신속하게 보호해주는
          <span className="bold-text"> AI 모자이크 기술</span>.
        </p>
        <div className="image-row">
          { [image1, image2, image3, image4].map((img, index) => (
            <div key={index} className="image-container">
              <img src={img} alt={`Dynamic alt text for image ${index}`} />
            </div>
          ))}
        </div>
        <p className="Text">
          <br/>
          <span className="im-Text">언제 어디서나,</span><br/>
          <span className="bold-text">단 한 번의 클릭으로 </span>
          당신의 정보를 안전하게 지키세요.<br/>
          <span className="bold-text">mos-AIc,</span>
          이제 걱정 없이 <span className="bold-text">소중한 순간들을 공유하세요.</span>
        </p>
        <img src={mainImage} alt="Main Image" style={{ filter: `blur(${blurValue}px)` }} />
        <Slider
          value={blurValue}
          min={0}
          max={10}
          onChange={(value) => setBlurValue(value)}
          className="slider"
        />
        <br/>
        <p className="im-Text">
            Mos-<span className = "highlighted-text">AI</span>c, 개인의 사생활을 보호하는 강력한 첫 걸음.
        </p>
      </main>
      <footer className="App-footer">
        <button onClick={handleLoginNavigate} className="A-Button">
          지금 바로 시작해보세요
        </button>
      </footer>
    </div>
        }
        />
        <Route path="/main" element={<Mainpage/>} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/mypage" element = {<Mypage/>}/>
        <Route path ="/account" element = {<Account/>}/>
      </Routes>
    </div>
  );
}

export default App;
