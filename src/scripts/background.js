chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "sendPageContentRequest") {
    const pageMain = message.pageMain;
    const pageTitle = message.pageTitle; // 수정된 부분: pageTitle 변수 사용
    const pageImage = message.pageImage;
    const urlData = message.currentURL;
    // 서버 URL 정의
    const serverURL = "http://218.209.111.55:80";
    // JSON 페이로드를 텍스트와 함께 생성
    const payload = { content: pageMain };

    // 서버에 POST 요청 보내기
    fetch(serverURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("서버 요청 실패. 상태 코드: " + response.status);
        }
        return response.json();
      })
      .then((result) => {
        // Storage에 데이터 저장
        chrome.storage.local.set(
          {
            [message.currentURL]: {
              url: urlData,
              title: pageTitle,
              image: pageImage,
              summary: result.summary,
              keyword: result.keyword,
            },
          },
          function () {
            console.log("Data saved to local storage!");
            chrome.runtime.sendMessage({
              action: "dataSaved",
              urlData, // 추가된 부분: 저장한 URL을 함께 보냅니다.
            });
            // 저장이 완료된 후, popup.js에 메시지를 보냅니다.
            chrome.runtime.sendMessage({
              action: "dataSaved",
            });
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
