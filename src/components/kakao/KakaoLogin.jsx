import React, { useEffect } from 'react';

const client_id = "38a2afec68e2505b2d742bbf2e8dea37";
const redirect_uri = "http://localhost:3000/login";
const response_type = "code";

const KakaoLogin = () => {
    useEffect(() => {
        const search = new URLSearchParams(window.location.search);
        const code = search.get("code");
        const accessToken = localStorage.getItem('access_token');

        if (code && (!accessToken || accessToken === "undefined")) {
            handleGetToken(code);
        }
    }, []);

    const handleGetToken = async (code) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/kakao/callback?code=${code}`);
            const tokenData = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', tokenData.access_token);
                // Optional: Redirect to a protected page or refresh to remove the code from URL
                window.location.replace('/');
            } else {
                console.error('Failed to retrieve token:', tokenData);
            }
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    const authParam = new URLSearchParams({
        client_id, redirect_uri, response_type
    });

    return (
        <a href={`https://kauth.kakao.com/oauth/authorize?${authParam.toString()}`} style={{ textDecoration: 'none', color: 'black' }}>
      <b>카카오 계정으로 1초 회원가입</b> 
        </a>
    );
};

export default KakaoLogin;
