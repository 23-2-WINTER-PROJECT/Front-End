import React, { useState } from "react";
import axios from "axios";

import './Mainpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Offcanvas, Select } from 'react-bootstrap';


import uploadImage from '../image/uploadImage.png';
import Navigation from '../components/Navigation';

const uploadURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/upload";
const invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/invert";

const Mainpage = () => {
    const [invertedImageUrl, setInvertedImageUrl] = useState(null);
    return (
        <div className = "M-background">
            <Navigation />
            <div class="container text-center">
            <div class="row">
                <div class="col left">
                </div>
                <div class="col mid">
                <SelectBar/>
                <br/>
                <Background />
                </div>
                <div class="col right">
                <ImageControl/>
                </div>
            </div>
            </div>
        </div>
    );
};

const SelectBar = () => (
    <select className="form-select" aria-label="Default select example">
    <option selected>모자이크를 원하는 카테고리를 선택하세요.</option>
    <option value="1">얼굴</option>
    <option value="2">자동차 번호판</option>
    <option value="3">카드번호</option>
    <option value="4">주소</option>
    </select>
);

const Background = () => (
    <div>
        <UploadBox />
    </div>
);

const ImageControl = () => (
    <div>
        <button className = "download-button">
            다운로드
        </button>
        <button className = "delete-button">
            삭제
        </button>
    </div>
);

const Logo = () => (
    <svg className="icon" x="0px" y="0px" viewBox="0 0 24 24">
        <path fill="transparent" d="M0,0h24v24H0V0z" />
        <image xlinkHref={uploadImage} width="24px" height="24px" />
    </svg>
);

const FileInfo = ({ uploadedInfo, invertedImageUrl }) => {
    if (!uploadedInfo && !invertedImageUrl) return null;

    return (
        <div className="preview_info">
            {uploadedInfo && !invertedImageUrl && (
                <img src={uploadedInfo.imageUrl} alt="Preview" style={{ maxWidth: '600px', maxHeight: '600px' }} />
            )}
            {invertedImageUrl && (
                <img src={invertedImageUrl} alt="Inverted Preview" style={{ maxWidth: '600px', maxHeight: '600px' }} />
            )}
        </div>
    );
};


const UploadBox = () => {
    const [uploadedInfo, setUploadedInfo] = useState(null);
    const [isActive, setActive] = useState(false);
    const [photoId, setPhotoId] = useState(null);
    const [invertedImageUrl, setInvertedImageUrl] = useState(null);

    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setActive(false);
    
        const file = event.dataTransfer.files[0];
        setFileInfo(file); 
    };

    const setFileInfo = (file) => {
        const { name, type } = file;
        const isImage = type.startsWith('image/');
        const size = (file.size / (1024 * 1024)).toFixed(2) + 'MB';
    
        if (!isImage) {
            setUploadedInfo({ name, size, type });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedInfo({ name, size, type, imageUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await axios.post(uploadURL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('File uploaded successfully:', response.data);
                setPhotoId(response.data.photo_id); // 이미지의 식별자 설정
                setFileInfo(file); // 미리보기 설정
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };


    const handleApi = () => {
        if (!photoId) {
            alert('이미지를 업로드해주세요.');
            return;
        }
    
        axios.post(invertURL, { photo_id: photoId }).then((res) => {
            console.log(res);
            const { detect, imgsrc } = res.data;
            if (detect) {
                const fullImageUrl = `https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/${imgsrc}`;
                setInvertedImageUrl(fullImageUrl); // 반전된 이미지 URL 설정
            } else {
                alert('다른 이미지를 선택해주세요.');
            }
        }).catch((error) => {
            console.error('Error inverting image:', error);
        });
    };
    
    return (
        <div>
            <label
                className={`preview${isActive ? ' active' : ''}`}
                onDragEnter={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragEnd}
                onDrop={handleDrop}
            >
                <div className="upload-box">
                    <input
                        type="file"
                        name="file"
                        className="drag-file"
                        onChange={handleUpload}                    
                    />
                    <FileInfo uploadedInfo={uploadedInfo} invertedImageUrl={invertedImageUrl} />
                    {!uploadedInfo && (
                        <>
                            <Logo />
                            <p className="upload-text">사진 파일을 업로드하거나 클릭</p>
                            <p className="sub-text">또는 여기에 파일 끌어다놓기</p>
                            <p className="sub-sub-text">*.jpg 또는 .png 파일만 첨부 가능</p>
                        </>
                    )}
                </div>
            </label>
            <div className="M-center">
                <button className="submit-button" onClick={handleApi}>mos-AIc</button>
            </div>
        </div>

    );
}

export default Mainpage;
