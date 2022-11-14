/**
 * source ~ 번역하고 싶은 텍스트 및 언어와 관련된 용어, 원본 언어
 * target ~ 번역된 결과 텍스트 및 언어와 관련된 용어, 타겟 언어
 * 
 * source select tag에 선택된 언어가 무엇인지 확인할 수 있도록 해당 언어의 코드값을 console에 출력할 수 있어야함
 * source textarea tag에 작성된 텍스트도 console에 출력할 수 있어야함
 * 
 * target select tag에 선택된 언어값 역시 console에 출력
 * ex) target select를 English로 선택할 경우, console에 en이 출력되어야함
 * ex) 기본값은 en으로
 * target textarea ? 추후 작성 예정
 * 
 * 
 * 
 */
/*
const sourceSel = document.getElementById("selSource");
const sourceTxt = document.getElementById("txtSource");

const targetSel = document.getElementById("selTarget");
const targetTxt = document.getElementById("txtTarget");

sourceSel.addEventListener('change', (event) => {
    console.log(sourceSel.value);
});

sourceTxt.addEventListener('input', (event)=>{

    console.log(sourceTxt.value);
});

targetSel.addEventListener('change', (event) => {
    console.log(targetSel.value);
});

targetTxt.addEventListener('input', (event)=>{

    console.log(targetTxt.value);
});
*/


const textAreaArray = document.getElementsByClassName('Card__body__content');
const [sourceTextArea, targetTextArea] = textAreaArray;
const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');

// 기본값 en
let targetLanguage = 'en';

targetSelect.addEventListener('change', () => {
    targetLanguage = targetSelect.value;
});

sourceTextArea.addEventListener('input', (event) => {
    const text = event.target.value; // 번역할 텍스트

    const url = '/detect'; // node서버로 번역 요청 전달을 위한 url

    // Node 서버로 API에서 요구하는 파라미터 값들을 전달해야함
    // XMLHttpRequest 객체 활용 - ajax programming

    // 1. XMLHttpRequest 객체 생성
    const xhr = new XMLHttpRequest();

    // 2. readyState가 4번(DONE)이고 응답코드(status)가 200이면 서버로부터 응답이 모두 완료되었음을 의미
    xhr.onload = () => { //성공했을 때,
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            //console.log(xhr.responseText);
            targetTextArea.value = xhr.responseText;
        }
    };

    // 3. 요청 준비 코드 작성
    xhr.open('POST', url);

    // 4. 클라이언트가 서버에게 보내는 데이터를 작성, 요청 메시지에 추가

    // 4-1. 요청을 보낼 데이터(JS Object)
    let requestData = {
        text, // text: text와 동일, 프로퍼티와 변수명이 동일할 경우 하나로 써도됨
        targetLanguage,
    };

    //4-2 요청을 보낼 데이터를 json 형태로 변환하여 전달
    requestData = JSON.stringify(requestData);

    //4.3 클라이언가 서버에게 보내는 요청 데이터의 형식(Content-Type)이 Json
    xhr.setRequestHeader('Content-Type', 'application/json');

    // 5. 실제 요청 전송하는 코드 작성
    xhr.send(requestData);
});




