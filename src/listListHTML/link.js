// link.js

document.addEventListener("DOMContentLoaded", function () {
  // 함수를 정의하여 데이터를 UI에 업데이트하는 로직을 모듈화합니다.
  function updateUIWithStoredData(currentURL) {
    // 로컬 스토리지에서 데이터 가져오기
    chrome.storage.local.get(currentURL, function (data) {
      const storedData = data[currentURL];

      // UI 업데이트
      // const titleElement = document.getElementById("url_title");
      // if (titleElement) {
      //   titleElement.textContent = storedData.title;
      //   titleElement.style.display = "block";
      //   titleElement.addEventListener("click", function () {
      //     // Call the function with the current URL when clicked
      //   updateUIWithStoredData(currentURL);
      // });
      const titleElement = document.getElementById("url_title");
      if (titleElement) {
        titleElement.textContent = storedData.title;
        titleElement.style.display = "block";
        const currentURL = titleElement.getAttribute("data-url");
        titleElement.addEventListener("click", function () {
          updateUIWithStoredData(currentURL);
        });
      }

      const imageElement = document.getElementById("mainImage");
      if (imageElement) {
        imageElement.src = storedData.image;
        imageElement.style.display = "block";
      }

      const summaryElement = document.getElementById("summary");
      if (summaryElement) {
        summaryElement.textContent = storedData.summary;
        summaryElement.style.display = "block";
      }

      const keywordListElement = document.querySelector(".keyword");
      if (keywordListElement) {
        keywordListElement.style.display = "block";
      }

      // 각 키워드를 해당하는 <a> 태그에 표시
      storedData.keyword.forEach((keyword, index) => {
        const keywordLinkElement = document.getElementById("key" + (index + 1));
        if (keywordLinkElement) {
          keywordLinkElement.textContent = keyword;
          keywordLinkElement.style.display = "inline";
        }
      });
    });
  };

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === "dataSaved") {
      // 데이터가 저장되면 UI 업데이트 함수 호출
      updateUIWithStoredData(message.urlData);
    }
  });
});
