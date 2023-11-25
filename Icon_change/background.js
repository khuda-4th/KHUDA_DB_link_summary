// background.js
let currentImageIndex = 1;

function changeIcon() {
  const newIcon = currentImageIndex === 1 ? "image2.png" : "image1.png";
  chrome.action.setIcon({ path: { 16: newIcon, 48: newIcon, 128: newIcon } });
  currentImageIndex = currentImageIndex === 1 ? 2 : 1;
}

// 백그라운드 스크립트에서 확장 아이콘 클릭 이벤트를 감지하고 아이콘 변경 함수 호출
chrome.action.onClicked.addListener(function (tab) {
  changeIcon();
});
