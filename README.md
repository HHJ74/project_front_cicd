# 🛒 Whipped

Whipped는 친환경 제품을 판매하는 쇼핑몰 웹사이트입니다. 이 프로젝트는 React와 Express를 사용하여 개발하였습니다.

## 🚀 기능

- 제품 목록 보기
- 장바구니에 제품 추가 및 제거
- 주문 및 결제 기능

## 📥 설치 방법

1. **레포지토리 클론:**

   ```bash
   git clone https://github.com/hyeyeon-34/whipped_f4.git
   cd whipped_f4

2. **의존성 설치**
   npm install

3. **서버 실행**
   npm start


## 🛠️ 에러 및 문제 해결
### 🚨 Uncaught SyntaxError: Unexpected token <
- 문제: 페이지를 새로고침할 때 404 에러가 발생하며, Uncaught SyntaxError: Unexpected token < 에러가 표시됩니다. 이 에러는 JavaScript 파일을 로드할 때 HTML 파일이 반환되어 < 기호를 JavaScript 문법으로 인식하지 못하는 경우 발생합니다.
- 해결 방법: index.html에 <base href='/' /> 태그를 추가하여 브라우저가 모든 상대 경로를 루트 디렉토리를 기준으로 해석하도록 설정했습니다.

### 🌐 404 에러 발생
- 문제: 페이지를 새로고침할 때 404 에러가 발생합니다. 이는 서버가 JavaScript 파일 대신 HTML 파일을 반환하는 경우 발생할 수 있습니다.
- 해결 방법: Nginx 또는 다른 웹 서버 설정에서 모든 경로 요청에 대해 index.html을 반환하도록 설정하여 클라이언트 사이드 라우팅이 제대로 작동하도록 합니다.





### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
