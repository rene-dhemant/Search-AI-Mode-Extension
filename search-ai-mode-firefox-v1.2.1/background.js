const FILTER = {
  urls: ['*://*.google.com/search*', '*://*.bing.com/search*', '*://search.brave.com/search*'],
  types: ['main_frame']
};

function redirectToAiMode(details) {
  const url = new URL(details.url);

  // Google: add &udm=50 parameter
  if (url.hostname.includes('google.com')) {
    if (url.searchParams.get('udm') === '50') return {};
    url.searchParams.set('udm', '50');
    return { redirectUrl: url.toString() };
  }

  // Bing: replace /search with /copilotsearch
  if (url.hostname.includes('bing.com') && url.pathname === '/search') {
    url.pathname = '/copilotsearch';
    return { redirectUrl: url.toString() };
  }

  // Brave: replace /search with /ask
  if (url.hostname === 'search.brave.com' && url.pathname === '/search') {
    url.pathname = '/ask';
    return { redirectUrl: url.toString() };
  }

  return {};
}

async function getEnabled() {
  const result = await browser.storage.local.get({ enabled: true });
  return result.enabled;
}

async function applyListener(enabled) {
  const isRegistered = browser.webRequest.onBeforeRequest.hasListener(redirectToAiMode);
  if (enabled && !isRegistered) {
    browser.webRequest.onBeforeRequest.addListener(redirectToAiMode, FILTER, ['blocking']);
  } else if (!enabled && isRegistered) {
    browser.webRequest.onBeforeRequest.removeListener(redirectToAiMode);
  }
}

browser.runtime.onInstalled.addListener(async () => {
  const enabled = await getEnabled();
  await browser.storage.local.set({ enabled });
  await applyListener(enabled);
});

browser.runtime.onStartup.addListener(async () => {
  const enabled = await getEnabled();
  await applyListener(enabled);
});

// Apply on load (covers cases where onStartup doesn't fire)
(async () => {
  const enabled = await getEnabled();
  await applyListener(enabled);
})();

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'getStatus') {
    return getEnabled().then(enabled => ({ enabled }));
  }
  if (message.type === 'setEnabled') {
    return browser.storage.local
      .set({ enabled: message.enabled })
      .then(() => applyListener(message.enabled))
      .then(() => ({ success: true }));
  }
});

