// KakaoUserInfo.js
import React from 'react';

const KakaoUserInfo = () => {

    const GetUserInfo = async () => {
        const ACCESS_TOKEN = localStorage.getItem("access_token");
        
        try {
            const response = await fetch("http://localhost:5000/auth/kakao/userinfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ access_token: ACCESS_TOKEN })
            });

            const result = await response.json();
            console.log("회원정보 :", result);
            return result;
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    return (
        <button onClick={GetUserInfo}>계정정보 추출</button>
    );
};

export default KakaoUserInfo;
