// Node.js, Express 패키지를 활용하여 간단한 서버 구성

const express = require('express');

const app = express();

//https://developers.naver.com/apps/#/myapps/JofANdb2YEtSGa__h2JS/overview
const clientId = 'JofANdb2YEtSGa__h2JS';
const clientSecret = 'HtE_Xq8VDa';

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
    //text프로퍼티에 있는 값을 query라는 이름의 변수에 담고 싶고, targetLanguage은ㄴ 그대로 동일한 이름으로 한다.
   const {text:query, targetLanguage} = request.body; 
    console.log(query,targetLanguage);
   //실제 papago 서버에 언어 감지 요청을 위한 url
   const url = 'https://openapi.naver.com/v1/papago/detectLangs';
    
   //실제 언어감지 API 요청 전송
   //options : 서버에 전송한 데이터 및 header 정솝 등을 모아 놓은 복합 객체(object)
   // () => {} : 요청에 따른 응답 정보를 확인하는 부분
   //중첩객체
   const options={
        url,
        form: {query},
        headers : {
                'X-Naver-Client-Id' : clientId,
                'X-Naver-Client-Secret' : clientSecret,
        }
   }
   
    httpRequest.post(options, (error, httpResponse, body) => {
        if (!error && httpResponse.statusCode === 200) {
            const parsedData = JSON.parse(body); // body를 parsing 처리 -> {"langCode":"ko"}
            console.log(`body is ${body}`);
            const sourceLanguage = parsedData.langCode;

            // // papago 번역 url('/translate')로 redirect(요청 재지정)
            // response.redirect(`translate?sourceLanguage=${sourceLanguage}&targetLanguage=${targetLanguage}&query=${query}`);
            response.send(body); //send가 json으로 자동으로 변경해줄까?

        } else { // 응답이 실패했을 경우
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }
    });

});

// papago 번역 요청 부분
app.get('/translate', (request, response) => {
    const paramData = request.query;
    const sourceLanguage = paramData.sourceLanguage;
    const targetLanguage = paramData.targetLanguage;
    const query = paramData.query;
    //const [sourceLanguage, targetLanguage, query] = paramDatae;
    console.log(sourceLanguage, targetLanguage, query);
   
    // 실제 번역 요청을 위한 url
    const url = 'https://openapi.naver.com/v1/papago/n2mt';

    // 실제 번역 API 요청 전송
    var options = {
        url,
        form: {'source':sourceLanguage, 'target':targetLanguage, 'text':query},
        headers: {'X-Naver-Client-Id':clientId, 'X-Naver-Client-Secret': clientSecret}
     };
    

     
     httpRequest.post(options, (error, httpResponse, body)=>{
        if (!error && httpResponse.statusCode == 200) {
            //console.log(`body is ${body}`);
            // {"message":{"result":{"srcLangType":"ko","tarLangType":"en","translatedText":"Hi.","engineType":"PRETRANS","pivot":null,"dict":null,"tarDict":null},"@type":"response","@service":"naverservice.nmt.proxy","@version":"1.0.0"}}
            const parsedData = JSON.parse(body);
            const translateText = parsedData.message.result.translatedText;
            
            response.end(translateText);

        } else { // 응답이 실패했을 경우
            console.log(`error = ${httpResponse.statusCode}, ${httpResponse.statusMessage}`);
        }

     });

    // 번역된 결과 텍스트값 출력(확인)
    
});

const port = 3000;
app.listen(port, () => console.log(`http://127.0.0.1:3000/ app listening on port ${port}`));
//naver.com를 치면 내부적으로 ip주소를 써야한다. 서비스 DNS 도메인 이름 시스템