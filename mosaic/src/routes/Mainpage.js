import React, { useState, useEffect } from "react";
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
    const [trainingImages, setTrainingImages] = useState([]); // 모델 학습 이미지 파일 배열
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

    // 모델 학습 이미지 업로드 핸들러 (다중 이미지)
    const handleTrainingImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setTrainingImages(files);
    };

    // 모델 학습 시작 핸들러
    const handleStartTraining = () => {
        if (!trainingCategory) {
            alert('카테고리 이름을 입력해주세요.');
            return;
        }

        // 사용자 정의 카테고리 추가
        setCustomCategories((prevCategories) => {
            if (!prevCategories.includes(trainingCategory)) {
                console.log("Adding new category:", trainingCategory); // 확인을 위한 콘솔 로그
                return [...prevCategories, trainingCategory];
            }
            return prevCategories;
        });

        setShowTrainModal(false); // 모델 학습 모달 닫기
        setShowLoadingModal(true); // 로딩 모달 열기

        // 3초 후에 로딩 모달 닫기 (예제 시간, 필요에 따라 조정 가능)
        setTimeout(() => {
            setShowLoadingModal(false);
        }, 3000);
    };

    // 상태 변화 감지 및 콘솔 로그 추가
    useEffect(() => {
        console.log("Updated customCategories:", customCategories);
    }, [customCategories]);

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
                                multiple // 다중 이미지 업로드 가능
                                onChange={handleTrainingImageUpload}
                            />
                        </Form.Group>
                        {trainingImages.length > 0 && (
                            <div className="image-list">
                                <p>{trainingImages.length}개의 이미지가 선택되었습니다.</p>
                            </div>
                        )}
                        <div className="modal-train-button-container">
                            <Button className="modal-train-button" onClick={handleStartTraining}>
                                학습 시작
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showLoadingModal} centered className="custom-modal">
                <Modal.Body>
                    <div className="loading-modal-content text-center">
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

const SelectBar = ({ onSelectCategory, customCategories }) => {
    console.log("Current customCategories:", customCategories); // 확인을 위한 콘솔 로그
    return (
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
};

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
                    withCredentials: true,
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
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/face"; // 얼굴 모자이크 API URL
                break;
            case "license_plate":
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/license_plate"; // 자동차 번호판 모자이크 API URL
                break;
            case "card_number":
                invertURL = ""; // 카드번호 모자이크 API URL
                break;
            case "address":
                invertURL = "https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/address"; // 주소 모자이크 API URL
                break;
            default:
                alert('카테고리를 선택해주세요.');
                return;
        }

        axios.post(invertURL, { photo_id: photoId }, {withCredentials : true}).then((res) => {
                console.log(res);
                const { detect, imgsrc } = res.data;
                if (detect) {
                    const fullImageUrl = `https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/${imgsrc}`;
                    setInvertedImageUrl(fullImageUrl); // 모자이크된 이미지 URL 설정
                } else {
                    alert('다른 이미지를 선택해주세요.');
                }
            })
            .catch((error) => {
                console.error('Error inverting image:', error);
            });
    };

    const handleDownload = async () => {
        if (invertedImageUrl) {
            // Fetch the image and convert it to a Blob
            try {
                const response = await fetch(invertedImageUrl);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
    
                // Create a link element and set its href to the Blob URL
                const link = document.createElement('a');
                link.href = url;
                link.download = 'mos-AIc_processed_image'; // Set the default file name for download
                document.body.appendChild(link); // Append the link to the body
                link.click(); // Simulate a click to trigger the download
                document.body.removeChild(link); // Remove the link from the body
                URL.revokeObjectURL(url); // Revoke the object URL after download
            } catch (error) {
                console.error('Error downloading the processed image:', error);
            }
        } else {
            alert('모자이크 처리 후 클릭 해주세요');
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
