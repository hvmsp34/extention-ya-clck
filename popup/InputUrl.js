import { urlValidation, showNotification } from "./utils.js";

const input = urlInput;

export default async function () {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const { url } = tab;
  isValidInputUrl(url);
  input.onfocus = function () { this.select(); };
  input.oninput = function () { isValidInputUrl(this.value); };
  console.log({ url, tab, input });
}

function isValidInputUrl(url) {
  urlValidation(url)
    .then(isValid => {
      shortenButton.setAttribute('active', isValid);
      if (!isValid) throw new Error('Работа с открытой страницей невозможна. Можете ввести URL самостоятельно, адрес должен начинаться с http:// или https://.');
      input.value = url;
    })
    .catch((error) => {
      showNotification(error.message || error, 'normal', 10000);
      console.error(error, url);
    });
}

