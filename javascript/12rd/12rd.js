// const my = document.getElementById("demo");

// my.innerHTML = "Hello World!";


// const box = document.getElementById("box");

// box.addEventListener("click", function () {
//   box.innerHTML = "클릭 했습니다!";
// });

// box.addEventListener("dblclick", function () {
//   box.innerHTML = "더블클릭 했습니다!";
// });

// box.addEventListener("wheel", function () {
//   box.innerHTML = "휠!";
// });

// box.addEventListener("dragstart", function () {
//   box.innerHTML = "드래그 시작!";
// });

// box.addEventListener("dragend", function () {
//   box.innerHTML = "드래그 종료!";
// });

const bt = document.getElementById("bt");
const tx = document.getElementById("tx");



bt.addEventListener("click", function () {
  tx.innerHTML = "클릭 했습니다!";
  
});

bt.addEventListener("dblclick", function () {
  tx.innerHTML = "더블클릭 했습니다!";
});

bt.addEventListener("mouseover", function () {
  tx.innerHTML = "커서가 버튼위에 있습니다!<br>버튼을 누르세요!";
});

bt.addEventListener("mouseout", function () {
  tx.innerHTML = "커서가 버튼 밖으로 나갔습니다!<br>버튼을 누르세요!";
});
