// popup.js

// 콘텐츠 스크립트에 메시지를 보내 크롤링을 시작하는 함수
function startCrawling() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // 콘텐츠 스크립트에 크롤링을 시작하도록 메시지를 보냅니다.
    chrome.tabs.sendMessage(tabs[0].id, { action: "startCrawling" });
  });
}

// 저장된 데이터를 처리하고 팝업 UI를 업데이트하는 함수
function processStoredData(currentURL) {
  chrome.storage.local.get(currentURL, function (data) {
    const storedData = data[currentURL];

    // 제목 결과 표시
    const titleElement = document.getElementById("url_title");
    titleElement.textContent = storedData.title;
    titleElement.style.display = "block";

    // 이미지 결과 표시
    // 이미지 주소 가져오기
    const mainImage = storedData.image;
    const imageElement = document.getElementById("mainImage");
    imageElement.src = mainImage;
    imageElement.style.display = "block";

    // 텍스트 요약 결과 표시
    const summaryElement = document.getElementById("summary");
    summaryElement.textContent = storedData.summary;
    summaryElement.style.display = "block";

    // 키워드 목록 표시
    const keywordListElement = document.querySelector(".keyword");
    keywordListElement.style.display = "block";

    // 각 키워드를 해당하는 <a> 태그에 표시
    storedData.keyword.forEach((keyword, index) => {
      const keywordLinkElement = document.getElementById("key" + (index + 1));
      if (keywordLinkElement) {
        keywordLinkElement.textContent = keyword;
        keywordLinkElement.style.display = "inline";
      }
    });
  });
}

// 팝업이 열릴 때의 이벤트 리스너
document.addEventListener("DOMContentLoaded", function () {
  // 팝업이 열릴 때 startCrawling 함수 호출
  startCrawling();

  // 팝업이 열릴 때 저장된 데이터가 있다면 이를 사용하여 UI 업데이트
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentURL = tabs[0].url;

    // 저장된 데이터가 있는지 확인
    chrome.storage.local.get(currentURL, function (data) {
      if (Object.keys(data).length > 0) {
        processStoredData(currentURL);
      } else {
        startCrawling();
      }
    });
  });

  // background.js로부터의 메시지 수신
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === "dataSaved") {
      // 저장된 데이터를 처리하고 UI 업데이트
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentURL = tabs[0].url;
        processStoredData(currentURL);
      });
    }
  });
});

// ... (나머지 코드는 그대로 유지)

// 사용자 이벤트 핸들러 및 초기 데이터 로드
document
  .getElementById("loadingContainer")
  .addEventListener("dblclick", function () {
    // Toggle visibility of elements
    document.getElementById("loadingContainer").style.display = "none";
    document.getElementById("mainImage").style.display = "block";
    document.querySelector(".url_title").style.display = "block";
    document.getElementById("summary").style.display = "block";

    document.getElementById("key1").style.display = "block";
    document.getElementById("key2").style.display = "block";
    document.getElementById("key3").style.display = "block";
  });

function getTabUrl(callback) {
  var queryInfo = {
    active: true, // 올바른 값으로 수정
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}

function renderUrl(statusText) {
  document.getElementById("result").textContent = statusText;
}

document.addEventListener("DOMContentLoaded", function () {
  var link = document.getElementById("getUrl");
  link.addEventListener("click", function () {
    getTabUrl(function (url) {
      renderUrl(url);
    });
  });
});
