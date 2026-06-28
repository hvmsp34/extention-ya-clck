
import { copyToClipboard, getUrlHistory, onChangedStorage } from "./utils.js";

export default class History extends HTMLElement {
  constructor() {
    super();
    this.list = this.querySelector('ul');
  }

  connectedCallback() {
    this.render();
    onChangedStorage.addListener(this.#handleStorageChange);
  }

  disconnectedCallback() {
    onChangedStorage.removeListener(this.#handleStorageChange);
  }

  async render() {
    const urlHistory = await getUrlHistory();
    const items = urlHistory.map(item => {
      const itemClone = templateItemHistory.content.cloneNode(true);
      Object.assign(itemClone.querySelector('[orig]'), {
        title: item.orig,
        textContent: item.orig
      });
      Object.assign(itemClone.querySelector('[short]'), {
        textContent: item.short,
        onclick: () => copyToClipboard(item.short)
      });
      return itemClone;
    });

    this.list.replaceChildren(...items);
  }

  #handleStorageChange = (changes, area) => {
    if (area === "local" && changes.urlHistory) this.render();
  };
}

customElements.define("clck-history", History);
