export const localStorage = browser.storage.local;
export const onChangedStorage = browser.storage.onChanged;

export function showNotification(text, status = normal, delay = 1500) {
  notification.textContent = text;
  notification.className = 'show';
  const color = {
    normal: 'hsl(0, 0%, 20%)',
    access: 'hsl(90, 100%, 35%)',
    error: 'hsl(0, 100%, 35%)',
  };
  notification.style.setProperty('--notification-bg-color', color[status]);
  setTimeout(() => notification.removeAttribute('class'), delay);
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(showNotification('Скопировано!', 'access'));
}

export async function getUrlHistory() {
  const { urlHistory } = await localStorage.get({ urlHistory: [] });
  return urlHistory;
}

export async function setUrlHistory(urlHistory) {
  await localStorage.set({ urlHistory });
}

export async function urlValidation(url) {
  return !!/^https?:\/\/.{3,}\..{2,}/i.test(url);
}

export function isValidInputUrl(url) {
  urlValidation(url)
    .then(isValid => {
      shortenButton.setAttribute('active', isValid);
      if (!isValid) throw new Error('Работа с открытой страницей невозможна. Можете ввести URL самостоятельно, адрес должен начинаться с http:// или https://.');
      urlInput.value = url;
    })
    .catch((error) => {
      showNotification(error.message || error, 'normal', 10000);
      console.error(error);
    });
}
