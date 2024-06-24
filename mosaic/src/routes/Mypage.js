import React, { useEffect, useState } from "react";
import axios from "axios";
import './Mypage.css';
import Navigation from '../components/Navigation';

function Mypage() {
    return (
        <div>
            <Navigation />
            <Background />
        </div>
    );
}

const Background = () => (
    <div className="My-background">
        <Profile />
        <Gallery />
    </div>
);

const Profile = () => {
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // 사용자 ID를 가져오는 API 호출
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/users_list`, {
                    withCredentials: true // 쿠키를 포함하여 요청
                });

                // 콘솔에 전체 응답 로그
                console.log("API 응답 (User ID):", response);

                // 사용자의 ID를 설정 (실제 데이터에 따라 조정 필요)
                if (response.data && response.data.uid) {
                    setUserId(response.data.uid);
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <div className="MY-text">
            {userId ? `${userId}님, 안녕하세요.` : "사용자 정보를 불러오는 중..."}
        </div>
    );
};

const Gallery = () => {
    const [photos, setPhotos] = useState([]); // 초기 상태를 빈 배열로 설정
    const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 상태 추가

    useEffect(() => {
        // 사용자의 사진 목록을 가져오는 API 호출
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/users_list`, {
                    withCredentials: true // 쿠키를 포함하여 요청
                });

                // 콘솔에 전체 응답 로그
                console.log("API 응답 (Photos):", response);

                // 서버로부터 받은 데이터를 적절히 처리
                if (response.data && Array.isArray(response.data.post_list)) {
                    setPhotos(response.data.post_list); // 받은 데이터 그대로 사용
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching photos:", error);
            }
        };

        fetchPhotos();
    }, []);

    const handleDelete = async (photoId) => {
        // 사진 삭제를 처리하는 API 호출
        try {
            await axios.delete(`https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/photos/${photoId}`, {
                withCredentials: true // 쿠키를 포함하여 요청
            });
            // 삭제된 사진을 UI에서 제거
            setPhotos(photos.filter(photo => photo.id !== photoId));
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    const handlePreview = (url) => {
        setPreviewUrl(url); // 미리보기 URL 설정
    };

    const closePreview = () => {
        setPreviewUrl(null); // 미리보기 닫기
    };

    return (
        <div className="gallery">
            {Array.isArray(photos) && photos.length > 0 ? (
                photos.map(photo => (
                    <div key={photo.id} className="photo-container" onClick={() => handlePreview(photo.url)}>
                        <img 
                            src={photo.url} // API 응답의 URL 그대로 사용
                            alt="Mosaic" 
                            className="photo" 
                            onError={(e) => {
                                e.target.src = '/fallback-image.png'; // 이미지 로드 실패 시 대체 이미지 표시
                                console.error("이미지 로드 실패:", photo.url);
                            }}
                        />
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }} className="M-delete-button">삭제</button>
                    </div>
                ))
            ) : (
                <p className="MY-text">사진이 없습니다.</p> // 빈 상태 메시지 추가
            )}

            {previewUrl && (
                <div className="preview-background" onClick={closePreview}>
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                </div>
            )}
        </div>
    );
};

export default Mypage;
