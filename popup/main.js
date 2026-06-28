import UrlHistory from "./History.js";
import ShortenButton from "./ShortenButton.js";
import { copyToClipboard, urlValidation, showNotification, isValidInputUrl } from "./utils.js";


const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
const { url } = tab;
isValidInputUrl(url);
urlInput.onclick = function () { this.select(); };
urlInput.oninput = function () { isValidInputUrl(this.value); };