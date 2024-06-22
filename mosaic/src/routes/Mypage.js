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
    )
};

const Background = () => (
    <div className="M-background">
        <Profile />
        <Gallery />
    </div>
);

const Profile = () => (
    <div className="MY-text">
        여기에 사용자의 프로필 정보나 간단한 소개를 추가할 수 있습니다.
    </div>
);

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const userId = "current_user_id"; // 사용자 ID를 동적으로 가져오는 로직 필요

    useEffect(() => {
        // 사용자의 사진 목록을 가져오는 API 호출
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`/api/photos?userId=${userId}`);
                setPhotos(response.data);
            } catch (error) {
                console.error("Error fetching photos:", error);
            }
        };

        fetchPhotos();
    }, [userId]);

    const handleDelete = async (photoId) => {
        // 사진 삭제를 처리하는 API 호출
        try {
            await axios.delete(`/api/photos/${photoId}`);
            // 삭제된 사진을 UI에서 제거
            setPhotos(photos.filter(photo => photo.id !== photoId));
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    return (
        <div className="gallery">
            {photos.map(photo => (
                <div key={photo.id} className="photo-container">
                    <img src={photo.url} alt="Mosaic" className="photo" />
                    <button onClick={() => handleDelete(photo.id)} className="delete-button">삭제</button>
                </div>
            ))}
        </div>
    );
};

export default Mypage;
