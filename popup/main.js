import UrlHistory from "./History.js";
import ShortenButton from "./ShortenButton.js";
import { copyToClipboard } from "./utils.js";

const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
if (tab && tab.url) urlInput.value = tab.url;
urlInput.onclick = function () { this.select(); };