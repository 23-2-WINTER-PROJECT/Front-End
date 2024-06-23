import React, { useState } from "react";
import axios from "axios";
import './Mainpage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form } from 'react-bootstrap';

import uploadImage from '../image/uploadImage.png';
import Navigation from '../components/Navigation';

const uploadURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/upload";
let invertURL = ""; // API URL을 카테고리에 따라 설정하기 위해 공백으로 남겨둠

const Mainpage = () => {
    const [invertedImageUrl, setInvertedImageUrl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(""); // 카테고리 상태 추가
    const [uploadedInfo, setUploadedInfo] = useState(null); // 업로드된 이미지 정보 상태 추가
    const [customCategories, setCustomCategories] = useState([]); // 사용자 정의 카테고리 상태
    const [showTrainModal, setShowTrainModal] = useState(false); // 모델 학습 모달 상태
    const [trainingCategory, setTrainingCategory] = useState(""); // 모델 학습 카테고리 이름
    const [trainingImage, setTrainingImage] = useState(null); // 모델 학습 이미지 파일
    const [showLoadingModal, setShowLoadingModal] = useState(false); // 로딩 모달 상태

    // 카테고리 선택 핸들러
    const handleSelectCategory = (event) => {
        setSelectedCategory(event.target.value);
    };

    // 이미지 삭제 핸들러
    const handleDeleteImage = () => {
        setUploadedInfo(null);
        setInvertedImageUrl(null);
    };

    // 모델 학습 모달 열기
    const handleOpenTrainModal = () => setShowTrainModal(true);
    // 모델 학습 모달 닫기
    const handleCloseTrainModal = () => setShowTrainModal(false);

    // 모델 학습 카테고리 입력 핸들러
    const handleTrainingCategoryChange = (event) => {
        setTrainingCategory(event.target.value);
    };

    // 모델 학습 이미지 업로드 핸들러
    const handleTrainingImageUpload = (event) => {
        const file = event.target.files[0];
        setTrainingImage(file);
    };

    // 모델 학습 시작 핸들러
    const handleStartTraining = async () => {
        if (!trainingCategory || !trainingImage) {
            alert('카테고리 이름과 이미지를 입력해주세요.');
            return;
        }

        setShowLoadingModal(true);
        setShowTrainModal(false);

        try {
            const formData = new FormData();
            formData.append('category', trainingCategory);
            formData.append('file', trainingImage);

            const response = await axios.post('https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/train', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Training completed:', response.data);

            // 모델 학습 완료 후 사용자 정의 카테고리 추가
            setTimeout(() => {
                setCustomCategories((prevCategories) => [...prevCategories, trainingCategory]);
                setShowLoadingModal(false); // 로딩 모달 닫기
            }, 7000); // 로딩 모달을 7초 동안 표시
        } catch (error) {
            console.error('Error during training:', error);
            setShowLoadingModal(false);
        }
    };

    return (
        <div className="M-background">
            <Navigation />
            <div className="container text-center">
                <div className="row">
                    <div className="col left"></div>
                    <div className="col mid">
                        <div className="category-section">
                            <SelectBar 
                                onSelectCategory={handleSelectCategory} 
                                customCategories={customCategories} // 사용자 정의 카테고리 전달
                            />
                            <button className="model-train-button" onClick={handleOpenTrainModal}>모델 학습</button>
                        </div>
                        <br />
                        <Background 
                            selectedCategory={selectedCategory} 
                            invertedImageUrl={invertedImageUrl} 
                            setInvertedImageUrl={setInvertedImageUrl} 
                            uploadedInfo={uploadedInfo} 
                            setUploadedInfo={setUploadedInfo} 
                            onDeleteImage={handleDeleteImage} // 이미지 삭제 핸들러 전달
                        />
                    </div>
                    <div className="col right"></div>
                </div>
            </div>

            {/* 모델 학습 모달 */}
            <Modal show={showTrainModal} onHide={handleCloseTrainModal} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>모델 학습</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>카테고리 이름</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="카테고리 이름을 입력하세요" 
                                value={trainingCategory}
                                onChange={handleTrainingCategoryChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>학습할 이미지 업로드</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*" 
                                onChange={handleTrainingImageUpload}
                            />
                        </Form.Group>
                        <div className="modal-train-button-container">
                            <Button className="modal-train-button" onClick={handleStartTraining}>
                                학습 시작
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* 로딩 모달 */}
            <Modal show={showLoadingModal} centered className="custom-modal">
                <Modal.Body>
                    <div className="loading-modal-content">
                        <p>모델이 학습 중입니다...</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

const SelectBar = ({ onSelectCategory, customCategories }) => (
    <select className="form-select" aria-label="Default select example" onChange={onSelectCategory}>
        <option value="">모자이크를 원하는 카테고리를 선택하세요.</option>
        <option value="face">얼굴</option>
        <option value="license_plate">자동차 번호판</option>
        <option value="card_number">카드번호</option>
        <option value="address">주소</option>
        {customCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
        ))}
    </select>
);

const Background = ({ selectedCategory, invertedImageUrl, setInvertedImageUrl, uploadedInfo, setUploadedInfo, onDeleteImage }) => (
    <div>
        <UploadBox 
            selectedCategory={selectedCategory} 
            invertedImageUrl={invertedImageUrl} 
            setInvertedImageUrl={setInvertedImageUrl} 
            uploadedInfo={uploadedInfo} 
            setUploadedInfo={setUploadedInfo} 
            onDeleteImage={onDeleteImage} // 이미지 삭제 핸들러 전달
        />
    </div>
);

const ImageControl = () => (
    <div>
        <button className="download-button">download</button>
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

const UploadBox = ({ selectedCategory, invertedImageUrl, setInvertedImageUrl, uploadedInfo, setUploadedInfo, onDeleteImage }) => {
    const [isActive, setActive] = useState(false);
    const [photoId, setPhotoId] = useState(null);

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

        // 카테고리에 따라 API URL 설정
        switch (selectedCategory) {
            case "face":
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/face-mosaic"; // 얼굴 모자이크 API URL
                break;
            case "license_plate":
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/license-plate-mosaic"; // 자동차 번호판 모자이크 API URL
                break;
            case "card_number":
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/card-number-mosaic"; // 카드번호 모자이크 API URL
                break;
            case "address":
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/address-mosaic"; // 주소 모자이크 API URL
                break;
            default:
                alert('카테고리를 선택해주세요.');
                return;
        }

        axios.post(invertURL, { photo_id: photoId })
            .then((res) => {
                console.log(res);
                const { detect, imgsrc } = res.data;
                if (detect) {
                    const fullImageUrl = `https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/${imgsrc}`;
                    setInvertedImageUrl(fullImageUrl); // 반전된 이미지 URL 설정
                } else {
                    alert('다른 이미지를 선택해주세요.');
                }
            })
            .catch((error) => {
                console.error('Error inverting image:', error);
            });
    };

    const handleDownload = () => {
        if (invertedImageUrl) {
            // Download the modified image from the backend
            const link = document.createElement('a');
            link.href = invertedImageUrl;
            link.download = 'mos-AIc_processed_image';
            link.click();
        } else if (uploadedInfo && uploadedInfo.imageUrl) {
            // Download the original uploaded image
            const link = document.createElement('a');
            link.href = uploadedInfo.imageUrl;
            link.download = uploadedInfo.name || 'uploaded_image';
            link.click();
        }
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
            <div className="button-container">
                <button className="submit-button" onClick={handleApi}>mos-AIc</button>
                <button className="download-button" onClick={handleDownload}>다운로드</button>
                <button className="delete-button" onClick={onDeleteImage}>사진 변경</button>
            </div>
        </div>
    );
};

export default Mainpage;
