import { copyToClipboard, showNotification, getUrlHistory, setUrlHistory } from "./utils.js";

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
    this.#setStateDisabled();
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
