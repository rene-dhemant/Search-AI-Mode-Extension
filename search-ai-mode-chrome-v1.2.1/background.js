const GOOGLE_RULE_ID = 1;
const BING_RULE_ID = 2;
const BRAVE_RULE_ID = 3;

const GOOGLE_AI_MODE_RULE = {
  id: GOOGLE_RULE_ID,
  priority: 1,
  action: {
    type: 'redirect',
    redirect: {
      transform: {
        queryTransform: {
          addOrReplaceParams: [{ key: 'udm', value: '50' }]
        }
      }
    }
  },
  condition: {
    urlFilter: '||google.com/search',
    resourceTypes: ['main_frame']
  }
};

const BING_COPILOT_RULE = {
  id: BING_RULE_ID,
  priority: 1,
  action: {
    type: 'redirect',
    redirect: {
      transform: {
        path: '/copilotsearch'
      }
    }
  },
  condition: {
    urlFilter: '||bing.com/search',
    resourceTypes: ['main_frame']
  }
};

const BRAVE_ASK_RULE = {
  id: BRAVE_RULE_ID,
  priority: 1,
  action: {
    type: 'redirect',
    redirect: {
      transform: {
        path: '/ask'
      }
    }
  },
  condition: {
    urlFilter: '||search.brave.com/search',
    resourceTypes: ['main_frame']
  }
};

async function getEnabled() {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  return enabled;
}

async function applyRules(enabled) {
  if (enabled) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [GOOGLE_RULE_ID, BING_RULE_ID, BRAVE_RULE_ID],
      addRules: [GOOGLE_AI_MODE_RULE, BING_COPILOT_RULE, BRAVE_ASK_RULE]
    });
  } else {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [GOOGLE_RULE_ID, BING_RULE_ID, BRAVE_RULE_ID]
    });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const enabled = await getEnabled();
  await chrome.storage.local.set({ enabled });
  await applyRules(enabled);
});

chrome.runtime.onStartup.addListener(async () => {
  const enabled = await getEnabled();
  await applyRules(enabled);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'getStatus') {
    getEnabled().then(enabled => sendResponse({ enabled }));
    return true;
  }
  if (message.type === 'setEnabled') {
    (async () => {
      await chrome.storage.local.set({ enabled: message.enabled });
      await applyRules(message.enabled);
      sendResponse({ success: true });
    })();
    return true;
  }
});

