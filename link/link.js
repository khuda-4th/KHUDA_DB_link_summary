// 최대 길이 설정
var maxTitleLength = 22;
var maxContentLength = 100;

// 클래스명을 사용하여 모든 contents-title에 대해 처리
var titleElements = document.querySelectorAll('.contents-title');
titleElements.forEach(function(titleElement) {
  if (titleElement.textContent.length > maxTitleLength) {
    titleElement.textContent = titleElement.textContent.substring(0, maxTitleLength) + '...';
  }
});

// 클래스명을 사용하여 모든 contents-summary에 대해 처리
var contentElements = document.querySelectorAll('.contents-summary');
contentElements.forEach(function(contentElement) {
  if (contentElement.textContent.length > maxContentLength) {
    contentElement.textContent = contentElement.textContent.substring(0, maxContentLength) + '...';
  }
});


