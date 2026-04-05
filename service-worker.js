// Service worker for Carnival+

chrome.runtime.onInstalled.addListener(() => {
  console.log('Carnival+: extension installed.');
});


// slop V
function isAllowedCarnivalUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    return /(^|\.)carnival\.hackclub\.com$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== 'CARNIVAL_FETCH') {
    return;
  }

  const payload = message.payload || {};
  const url = payload.url;

  if (!isAllowedCarnivalUrl(url)) {
    sendResponse({
      ok: false,
      error: 'Blocked request: URL must be https://*.carnival.hackclub.com'
    });
    return;
  }

  const requestInit = {
    method: payload.method || 'GET',
    headers: payload.headers || undefined,
    body: payload.body || undefined
  };

  fetch(url, requestInit)
    .then(async (response) => {
      const text = await response.text();
      sendResponse({
        ok: true,
        status: response.status,
        statusText: response.statusText,
        body: text,
        headers: Object.fromEntries(response.headers.entries())
      });
    })
    .catch((error) => {
      sendResponse({
        ok: false,
        error: error && error.message ? error.message : String(error)
      });
    });

  return true;
});
