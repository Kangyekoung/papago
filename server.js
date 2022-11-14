// Node.js, Express 패키지를 활용하여 간단한 서버 구성

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

//https://developers.naver.com/apps/#/myapps/JofANdb2YEtSGa__h2JS/overview
//https://www.npmjs.com/search?q=dotenv
 //const clientId = 'JofANdb2YEtSGa__h2JS';
 //const clientSecret = 'HtE_Xq8VDa';
 const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SCREDT;
 console.log(clientId, clientSecret);

//다른쪽으로 요청할려고하면 request 객체 얻어와야한다.
const httpRequest  = require('request');

// express의 static 미들웨어 활용
app.use(express.static('public'));

// express의 JSON 미들웨어 활용
app.use(express.json());

// /: ROOT 경로
app.get('/', (request, response) => {
    response.sendFile('index.html') /* statcie file */
});


// localhost:3000/detect 결로로 요청했을 때 동작할 함수
app.post('/detect', (request, response) => {
   //실제 papago 서버에 언어 감지 요청을 위한 url
   const url = 'https://openapi.naver.com/v1/papago/detectLangs';
    
    httpRequest.post(optionForm(url, request.body), (error, httpResponse, body) => {
        if (!error && httpResponse.statusCode === 200) {
            response.send(body); 

        } else { // 응답이 실패했을 경우
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });

});

// papago 번역 요청 부분
app.post('/translate', (request, response) => {
    // 실제 번역 요청을 위한 url
    const url = 'https://openapi.naver.com/v1/papago/n2mt';
    

     console.log(optionForm(url, request.body));
     
     httpRequest.post(optionForm(url, request.body), (error, httpResponse, body) => {
        if (!error && httpResponse.statusCode === 200) {
            //translate body {"message":{"result":{"srcLangType":"ko","tarLangType":"en","translatedText":"Hi.","engineType":"PRETRANS","pivot":null,"dict":null,"tarDict":null},"@type":"response","@service":"naverservice.nmt.proxy","@version":"1.0.0"}}
            response.send(body); 

        } else { // 응답이 실패했을 경우
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });

    // 번역된 결과 텍스트값 출력(확인)
    
});

const port = 3000;
app.listen(port, () => console.log(`http://127.0.0.1:3000/ app listening on port ${port}`));
//naver.com를 치면 내부적으로 ip주소를 써야한다. 서비스 DNS 도메인 이름 시스템

//유틸 메소드
const optionForm = (url, form, headers) =>{
    var options = {
        url,
        form,
        headers: {
            'X-Naver-Client-Id':clientId, 
            'X-Naver-Client-Secret': clientSecret,
            ...headers,
        }
     };

     return options;
};