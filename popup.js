// Автоматически берем URL текущей открытой вкладки и вставляем в инпут
const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
if (tab && tab.url) urlInput.value = tab.url;

// Обработчик "подтверждения" (клик по кнопке)
shortenBtn.onclick = async () => {
  const rawUrl = urlInput.value.trim();
  if (!rawUrl) return;

  shortenBtn.disabled = true;
  shortenBtn.textContent = 'Сокращаю...';

  const endpoint = 'https://clck.ru';

  try {
    const targetUrl = new URL(endpoint);
    targetUrl.searchParams.append('url', rawUrl);

    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error('Ошибка сети');
    
    const shortUrl = await response.text();

    // Показываем результат в интерфейсе
    resultLink.href = shortUrl;
    resultLink.textContent = shortUrl;
    resultContainer.style.display = 'block';
  } catch (error) {
    console.error(error);
    alert('Произошла ошибка при сокращении ссылки.');
  } finally {
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Сократить';
  }
};