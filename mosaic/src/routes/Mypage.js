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

const Profile = () => (
    <div className="MY-text">
        여기에 사용자의 프로필 정보나 간단한 소개를 추가할 수 있습니다.
    </div>
);

const Gallery = () => {
    const [photos, setPhotos] = useState([]); // 초기 상태를 빈 배열로 설정
    const userId = "current_user_id"; // 사용자 ID를 실제로 동적으로 가져오는 로직으로 교체해야 함

    useEffect(() => {
        // 사용자의 사진 목록을 가져오는 API 호출
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/users_list`, {
                    params: { userId }
                });
                
                // 서버로부터 받은 데이터를 적절히 처리
                if (response.data && Array.isArray(response.data.post_list)) {
                    setPhotos(response.data.post_list);
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching photos:", error);
            }
        };

        fetchPhotos();
    }, [userId]);

    const handleDelete = async (photoId) => {
        // 사진 삭제를 처리하는 API 호출
        try {
            await axios.delete(`https://port-0-back-end-am952nlsys9dvi.sel5.cloudtype.app/photos/${photoId}`);
            // 삭제된 사진을 UI에서 제거
            setPhotos(photos.filter(photo => photo.id !== photoId));
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    return (
        <div className="gallery">
            {Array.isArray(photos) && photos.length > 0 ? (
                photos.map(photo => (
                    <div key={photo.id} className="photo-container">
                        <img src={photo.url} alt="Mosaic" className="photo" />
                        <button onClick={() => handleDelete(photo.id)} className="M-delete-button">삭제</button>
                    </div>
                ))
            ) : (
                <p className = "MY-text">사진이 없습니다.</p> // 빈 상태 메시지 추가
            )}
        </div>
    );
};

export default Mypage;
