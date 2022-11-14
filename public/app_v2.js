const textAreaArray = document.getElementsByClassName('Card__body__content');
const [sourceTextArea, targetTextArea] = textAreaArray;
const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');


let targetLanguage = 'en';

targetSelect.addEventListener('change', () => {
    targetLanguage = targetSelect.value;
});

let debouncer; //디바운싱 & 쓰로틀링
sourceTextArea.addEventListener('input', (event) => {
    if(debouncer) clearTimeout(debouncer);

    debouncer = setTimeout(async() => {
        const text = event.target.value; // 번역할 텍스트
        
        //비어있는 텍스트면 서버에 전송할 필요로가 없도록 코드 작성
        if(!text) return;
    
        console.log("sourceSelect : ", sourceSelect);
        console.log("targetLanguage : ", targetLanguage);

        let url = "/detect";
        await fetch(url, optionsFrom('POST', {query:text}))
            .then (response=>response.json())//결과값, 체이닝
            .then(async data => {
                console.log("data.langCode", data.langCode);
                const responseLangCode = data.langCode;
                sourceSelect.value= responseLangCode;

                
                //언어감지sourceSelect 번역언어 targetSelect
                if(responseLangCode === targetLanguage ){
                    if(responseLangCode === "ko"){
                        targetLanguage = "en";
                    }else{
                        targetLanguage = "ko";
                    }
                }
                
            

                
                url = '/translate';
                await fetch(url, optionsFrom('POST', 
                    {source:responseLangCode, target:targetLanguage, text}))
                    .then (response=>response.json())//결과값, 체이닝
                    .then(data => {
                        //console.log("translate data", data);
                        ////translate body {"message":{"result":{"srcLangType":"ko","tarLangType":"en","translatedText":"Hi.","engineType":"PRETRANS","pivot":null,"dict":null,"tarDict":null},"@type":"response","@service":"naverservice.nmt.proxy","@version":"1.0.0"}}
                        const responseData = data.message.result;

                        targetSelect.value = responseData.tarLangType;  //??
                        targetTextArea.value = responseData.translatedText;// 번역텍스트
                        
                    
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
   }, 2000);

       


});

/*
    
    예외처리 
    작성 도중이면 전송 못하게 하고,
    작성이 끝나고 2초 후에 전송하도록
    1. sourceSelect, targetSelect 는 같으면  변역 API 호출(erver.js translate 함수 호출 ) 하지 않는다.
        언어감지 : 한국어면
        결과값 : 한국어 -> 자동 영어로 변경하여서 출력
    2. 언어자동감지 detect 결과 값이 unk 이면 변역 API 호출(erver.js translate 함수 호출 ) 하지 않는다.
    2. targetSelect <번역할 언어> 선택 되었을 시에 변역 API 호출(erver.js translate 함수 호출 ) 하지 않는다.
    
*/


/*
const body = {query:'문자열값'};
const header = {
    'X-Naver-Client-Id' : clientId,
     'X-Naver-Client-Secret' : clientSecret,
}
*/


//유틸 메소드
const optionsFrom = (method, body, heders) =>{
    const options = {
        method,
        headers:{
            
            'Content-Type' : 'application/json',
            ...heders,
        },
        body : JSON.stringify(body),
    };
    console.log(options);
    return options;

}

//optionsFrom('POST', {query: '변역해'});


