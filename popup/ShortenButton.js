import { copyToClipboard, showNotification, getUrlHistory, setUrlHistory, urlValidation } from "./utils.js";

export default class ShortenButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }

  #setStateDisabled() {
    this.disabled = false;
    this.textContent = 'Сократить';
  }

  #setStateInProgress() {
    this.disabled = true;
    this.textContent = 'Сокращаю...';
  }

  #setStateEnabled() {
    this.disabled = false;
    this.textContent = 'Сократить';
  }

  async #apiRequest() {
    if (!urlInput) throw new Error('Поле ввода не найдено');
    const rawUrl = urlInput.value;
    if (!await urlValidation(rawUrl)) throw new Error('Неверный формат ссылки. Убедитесь, что адрес начинается с http:// или https://');
    if (!rawUrl) throw new Error('Введите ссылку');
    const endpoint = 'https://clck.ru/--';
    const targetUrl = new URL(endpoint);
    targetUrl.searchParams.append('url', rawUrl);

    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Ошибка сети');

    const shortUrl = await response.text();
    copyToClipboard(shortUrl);

    return { orig: rawUrl, short: shortUrl };
  }

  async #localSave(obj) {
    const urlHistory = await getUrlHistory();
    const filteredHistory = urlHistory.filter(item => item.orig !== obj.orig);
    const data = [obj, ...filteredHistory].slice(0, 10);
    setUrlHistory(data);
  }

  handleClick = async () => {
    this.#setStateInProgress();
    try {
      const data = await this.#apiRequest();
      await this.#localSave(data);
    } catch (error) {
      showNotification(error.message || error, 'error', 5000);
      console.error(error);
    } finally {
      this.#setStateEnabled();
    }
  };
}

customElements.define('clck-shorten-button', ShortenButton);
