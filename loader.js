
window.addEventListener('DOMContentLoaded', () => {
    // Загрузка картинок - ВСЕГДА загружаем картинки независимо от языка
    if (typeof IMAGES_DATA !== 'undefined') {
        Object.entries(IMAGES_DATA).forEach(([id, src]) => {
            const el = document.getElementById(id);
            if (el) el.src = src;
        });
    }
    
    // Загрузка текста (кроме языкового переключателя) - ТОЛЬКО для русского языка
    const currentLang = localStorage.getItem('selectedLanguage');
    if (currentLang === 'ru' || !currentLang) {
        console.log('Loading Russian content for language:', currentLang || 'ru');
        if (typeof CONTENT_DATA !== 'undefined') {
            Object.entries(CONTENT_DATA).forEach(([id, text]) => {
                const el = document.getElementById(id);
                // Не перезаписывать языковой переключатель
                if (el && id !== 'lang-current') {
                    el.innerText = text;
                }
            });
        }
    } else {
        console.log('Skipping Russian content loading for language:', currentLang);
    }
});
