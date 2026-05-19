# Search AI Mode Extension

Browser extensions for Chrome and Firefox that automatically activate AI Mode for Google, Bing, and Brave searches.

![image](https://raw.githubusercontent.com/rene-dhemant/Search-AI-Mode-Extension/refs/heads/main/promo-marquee-1400x560.jpg)

## Project Overview

The project consists of two browser extensions (Chrome MV3 and Firefox MV2) that automatically activate AI modes for **Google**, **Bing**, and **Brave** searches.

- **Google**: Appends `&udm=50`
- **Bing**: Redirects `/search` to `/copilotsearch`
- **Brave**: Redirects `/search` to `/ask`

## What It Does ✅

This extension automatically:

- **Google Search** — Appends `&udm=50` parameter to every Google Search query, activating Google's AI Mode (when available in your region)
- **Bing Search** — Redirects Bing Search queries to Bing Copilot Search (`bing.com/copilotsearch`) for instant AI-powered results
- **Brave Search** — Redirects Brave Search queries to Brave Ask (`search.brave.com/ask`) for AI-assisted search
- **Toggle Control** — Simple popup toggle to enable/disable the extension on demand
- **Persistent State** — Remembers your preference across browser restarts (enabled by default)
- **Lightweight** — Zero dependencies, minimal footprint, no data collection

## What It Does NOT Do ❌

This extension explicitly **does not:**

- Modify search results or ranking
- Collect, store, or transmit your search queries
- Change results for search engines other than Google, Bing, and Brave
- Inject ads or promotional content
- Modify any websites except search results pages
- Require account creation or login
- Ask for internet access beyond search engine domains
- Work on search results that don't originate from the search engine (e.g., local file searches)
- Modify Google Images, Google Maps, or other Google services (only Search)
- Change Bing News, Bing Images, or other Bing services (only Web Search)
- Change Brave Social, Brave News, or other Brave services (only Search)
- Work on archived or cached search results

## Installation

### Chrome / Chromium / Edge

1. Download the latest release
2. Extract the ZIP file
3. Go to `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked**
6. Select the extracted `search-ai-mode-chrome` folder
7. The extension icon will appear in your toolbar

### Firefox

1. Download the latest release
2. Extract the ZIP file
3. Go to `about:debugging#/runtime/this-firefox`
4. Click **Load Temporary Add-on**
5. Select the `manifest.json` file from the extracted `search-ai-mode-firefox` folder
6. The extension icon will appear in your toolbar

**Note:** Firefox's temporary add-on loading is for development/testing. For persistent installation, the extension would need to be submitted to Mozilla's Add-on store.

## Usage

1. Click the extension icon in your toolbar
2. Toggle **ON** to activate (default)
3. Toggle **OFF** to disable
4. Visit Google Search, Bing Search, or Brave Search — the extension automatically applies when enabled

### Example

**Before:** `https://www.google.com/search?q=machine learning`  
**After:** `https://www.google.com/search?q=machine learning&udm=50`

**Before:** `https://www.bing.com/search?q=machine learning`  
**After:** `https://www.bing.com/copilotsearch?q=machine learning`

**Before:** `https://search.brave.com/search?q=machine learning`  
**After:** `https://search.brave.com/ask?q=machine learning`

## Technical Details

### Chrome (Manifest V3)

- **Mechanism:** `chrome.declarativeNetRequest` with dynamic rules
- **Rules:**
  - Rule ID=1: Injects `&udm=50` to Google Search URLs
  - Rule ID=2: Redirects Bing Search URLs to Copilot
  - Rule ID=3: Redirects Brave Search URLs to Ask
- **Performance:** Network-layer redirect (zero JavaScript overhead)

### Firefox (Manifest V2)

- **Mechanism:** `browser.webRequest.onBeforeRequest` with URL manipulation
- **Listener:** Single listener handles all three search engines:
  - Google: `searchParams.set('udm', '50')`
  - Bing: `pathname` replacement (`/search` → `/copilotsearch`)
  - Brave: `pathname` replacement (`/search` → `/ask`)
- **Logic:** JavaScript URL parsing and rewriting

### Shared

- **Storage:** `browser.storage.local` with key `enabled` (persists across restarts)
- **Permissions:** Minimal — only read/write on search engine domains
- **No External Calls:** Everything happens locally in your browser

## Building From Source

Both extensions contain no build steps — they're ready to load directly:

1. **Chrome:** Drag the `search-ai-mode-chrome` folder into `chrome://extensions`
2. **Firefox:** Load `search-ai-mode-firefox/manifest.json` into `about:debugging`

No dependencies, no compilation, no bundling required.

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Supported |
| Chromium | Latest | ✅ Supported |
| Edge | 88+ | ✅ Supported |
| Firefox | 57+ | ✅ Supported |

## Privacy

This extension:
- ✅ Runs entirely in your browser
- ✅ Does not send data to external servers
- ✅ Does not track search queries
- ✅ Does not require user accounts
- ✅ Does not store search history

## License

MIT

## Disclaimer

This extension is provided as-is. It is not affiliated with Google, Microsoft, Bing, Brave, or any other search provider. Use at your own discretion. Feature availability depends on your region and your search provider's account status.
