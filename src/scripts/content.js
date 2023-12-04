// content.js

function findRepresentativeImage() {
  // 페이지 내의 모든 이미지 요소를 선택
  var images = document.querySelectorAll("img");

  // 페이지에 이미지가 없는 경우
  if (images.length === 0) {
    console.log("이 페이지에 이미지가 없습니다.");
    return null;
  }
  // 첫 번째 이미지를 대표 이미지로 선택
  var representativeImage = images[0].src;

  return representativeImage;
}

// Background에 페이지 내용 전송
function sendPageContentRequest() {
  // 현재 페이지 URL 가져오기
  const currentURL = window.location.href;
  const pageTitle = document.title;
  const pageImage = findRepresentativeImage();
  let pageMain;

  // 웹페이지 내용 가져오기
  if (currentURL.includes("velog")) {
    const velogElement = document.querySelector(".sc-bXTejn.vrbZh.atom-one");
    pageMain = velogElement ? velogElement.innerText : "";
  } else if (currentURL.includes("tistory")) {
    const tistoryElement = document.querySelector(
      ".tt_article_useless_p_margin.contents_style"
    );
    pageMain = tistoryElement ? tistoryElement.innerText : "";
  } else if (currentURL.includes("github.io")) {
    const githubElement = document.querySelector(".post-content");
    pageMain = githubElement ? githubElement.innerText : "";
  } else if (currentURL.includes("medium")) {
    pageMain = document.body.innerText;
  } else if (currentURL.includes("youtube")) {
    // 유튜브는 채널장 가져오기
    const channelOwnerElement = document.querySelector(
      ".yt-simple-endpoint.style-scope.yt-formatted-string"
    );
    pageMain = channelOwnerElement ? channelOwnerElement.textContent : "";
  } else {
    // 위 조건 중 하나에 해당하지 않을 때
    pageMain = document.body.innerText;
  }

  // 만약 pageMain이 여전히 비어 있다면 document.body.innerText 사용
  if (!pageMain) {
    pageMain = document.body.innerText;
  }

  // Background에 페이지 내용과 이미지 URL 전송
  chrome.runtime.sendMessage({
    action: "sendPageContentRequest",
    pageMain,
    pageTitle,
    currentURL,
    pageImage,
  });
}

// popup.js로부터의 메시지 수신
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startCrawling") {
    // startCrawling 메시지를 받으면 크롤링 함수를 실행합니다.
    findRepresentativeImage();
    sendPageContentRequest();
  }
});
