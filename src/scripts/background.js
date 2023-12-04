chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.action === "sendPageContentRequest") {
    try {
      const pageMain = message.pageMain;
      const pageTitle = message.pageTitle;
      const pageImage = message.pageImage;
      const serverURL = "http://218.209.111.55:80";
      const streamlitServerURL = "http://linkhuda.streamlit.app:8501/update_data";

      const payload = { content: pageMain };

      // 서버에 POST 요청 보내기
      const response = await fetch(serverURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("서버 요청 실패. 상태 코드: " + response.status);
      }

      const result = await response.json();

      // Storage에 데이터 저장
      chrome.storage.local.set(
        {
          [message.currentURL]: {
            title: pageTitle,
            image: pageImage,
            summary: result.summary,
            keyword: result.keyword,
          },
        },
        function () {
          console.log("Data saved to local storage!");

          // 저장이 완료된 후, popup.js에 메시지를 보냅니다.
          chrome.runtime.sendMessage({
            action: "dataSaved",
          });
        }
      );

      const streamlitPayload = {
        currentURL: message.currentURL,
        title: pageTitle,
        image: pageImage,
        summary: result.summary,
        keyword: result.keyword,
      };

      // Streamlit 서버에 데이터를 보내기 위한 Fetch 옵션
      const streamlitFetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(streamlitPayload),
      };

      // Streamlit 서버로 데이터 전송
      const streamlitResponse = await fetch(streamlitServerURL, streamlitFetchOptions);

      if (!streamlitResponse.ok) {
        throw new Error("Streamlit 서버 요청 실패. 상태 코드: " + streamlitResponse.status);
      }

      const streamlitResult = await streamlitResponse.json();
      console.log("Streamlit 서버 응답:", streamlitResult);
    } catch (error) {
      console.error(error);
    }
  }
});