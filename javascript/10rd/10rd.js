var now = new Date(); // 오늘 날짜 정보를 Date 객체의 인스턴스 now갹채로 만든다
var firstDay = new Date("2002-02-07"); // 처음 만난 날의 날짜 정보를 first Day 객체의 인스턴스로 만든다
var toNow = now.getTime(); // 오늘 날짜를 밀리초로 변환
var toFirst = firstDay.getTime(); // 처음 만난 날을 밀리초로 변환
var passedTime = toNow - toFirst; // 처음 만난 날부터 오늘까지의 경과 시간을 밀리초로 계산
var passedDays = Math.round(passedTime / (1000 * 60 * 60 * 24)); // 밀리초를 일로 변환 후 반올림하여 경과 일수를 계산
document.querySelector('#accent').innerText = passedDays + "일";


calcDate(100); // 100일 기념일을 계산해서 표시합니다
calcDate(200); // 200일 기념일을 계산해서 표시합니다
calcDate(365); // 1년 기념일을 계산해서 표시합니다
calcDate(700); // 700일 기념일을 계산해서 표시합니다
calcDate(1000); // 1000일 기념일을 계산해서 표시합니다

function calcDate(days) {
    var future = toFirst + (days * 24 * 60 * 60 * 1000); // 처음 만난 날에 밀리초로 바꾼 100일을 더하여 100일 기념일의 밀리초를 계산
    var someday = new Date(future); // future값을 사용하여 Date 객체의 인스턴스를 생성
    var year = someday.getFullYear(); // '연도'를 가져와 year 변수에 저장
    var month = someday.getMonth() + 1; // '월'을 가져와 month 변수에 저장 (월은 0부터 시작하므로 +1)
    var date = someday.getDate(); // '일'을 가져와 date 변수에 저장
    document.querySelector('#date' + days).innerText = year + "년 " + month + "월 " + date + "일";
    document.querySelector('#sDate').innerText = "처음 만난 날: " + firstDay.getFullYear() + "년 " + (firstDay.getMonth() + 1) + "월 " + firstDay.getDate() + "일";
}