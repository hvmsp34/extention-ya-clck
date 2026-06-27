function showToast() {
  toast.className = 'show';
  setTimeout(() => toast.removeAttribute('class'), 1500);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(showToast);
}

async function renderHistory() {
  const { urlHistory } = await browser.storage.local.get({ urlHistory: [] });
  if (urlHistory.length === 0) return;
  const items = urlHistory.map(item => {
    const itemClone = historyItemTemplate.content.cloneNode(true);
    Object.assign(itemClone.querySelector('.url-orig'), {
      title: item.orig,
      textContent: item.orig
    });
    Object.assign(itemClone.querySelector('.url-short'), {
      textContent: item.short,
      onclick: () => copyToClipboard(item.short)
    });
    return itemClone;
  });
  historyWrapper.replaceChildren(...items);
}


const endpoint = 'https://clck.ru/--';
const targetUrl = new URL(endpoint);
const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
if (tab && tab.url) urlInput.value = tab.url;
renderHistory();


shortenBtn.onclick = async () => {
  const rawUrl = urlInput.value.trim();
  if (!rawUrl) return;

  Object.assign(shortenBtn, {
    disabled: true,
    textContent: 'Сокращаю...'
  });

  try {
    targetUrl.searchParams.append('url', rawUrl);
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Ошибка сети');
    const shortUrl = await response.text();
    resultLink.textContent = shortUrl;
    resultContainer.style.display = 'block';
    copyToClipboard(shortUrl);
    const { urlHistory } = await browser.storage.local.get({ urlHistory: [] });
    const filteredHistory = urlHistory.filter(item => item.orig !== rawUrl);
    const updatedHistory = [{ orig: rawUrl, short: shortUrl }, ...filteredHistory].slice(0, 10);
    await browser.storage.local.set({ urlHistory: updatedHistory });
    renderHistory();
  } catch (error) {
    console.error(error);
    alert('Произошла ошибка при сокращении ссылки.');
  } finally {
    Object.assign(shortenBtn, {
      disabled: false,
      textContent: 'Сократить'
    });
  }
};


resultLink.onclick = () => copyToClipboard(resultLink.textContent);


