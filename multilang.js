// Система мультиязычности - интегрированная с existing language-switcher.js
class MultiLanguage {
    constructor() {
        // Auto-detect browser language if no saved preference
        if (!localStorage.getItem('selectedLanguage')) {
            const browserLang = navigator.language || navigator.userLanguage;
            
            const langMap = {
                'ru': 'ru',
                'ru-RU': 'ru',
                'be': 'ru',  // Belarusian -> Russian
                'kk': 'ru',  // Kazakh -> Russian
                'uk': 'uk',
                'uk-UA': 'uk',
                'en': 'en',
                'en-US': 'en',
                'en-GB': 'en'
            };
            
            const detectedLang = langMap[browserLang] || 'ru';
            localStorage.setItem('selectedLanguage', detectedLang);
            this.currentLang = detectedLang;
        } else {
            this.currentLang = localStorage.getItem('selectedLanguage');
        }
        
        this.translations = TRANSLATIONS;
        this.init();
    }

    init() {
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLanguage());
        } else {
            this.setupLanguage();
        }
    }

    setupLanguage() {
        console.log('MultiLanguage: Initializing with language:', this.currentLang);
        
        // Ensure RU is set as default if no language is saved
        if (!localStorage.getItem('selectedLanguage')) {
            this.currentLang = 'ru';
            localStorage.setItem('selectedLanguage', 'ru');
        }
        
        // Apply translations immediately if DOM is ready, otherwise wait
        this.changeLanguage(this.currentLang);
        this.updateAllSwitchers();
        
        // Also apply translations after DOM is fully loaded to ensure all elements are ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    this.changeLanguage(this.currentLang);
                    this.updateAllSwitchers();
                }, 50);
            });
        }
    }

    changeLanguage(lang) {
        if (!this.translations[lang]) {
            console.warn('MultiLanguage: Language not found:', lang);
            return;
        }
        
        console.log('MultiLanguage: Changing language to:', lang);
        this.currentLang = lang;
        
        // Обновляем все элементы с data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[lang][key]) {
                element.textContent = this.translations[lang][key];
            }
        });

        // Обновляем элементы с placeholder
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[lang][key]) {
                element.placeholder = this.translations[lang][key];
            }
        });

        // Обновляем элементы с value
        const values = document.querySelectorAll('[data-i18n-value]');
        values.forEach(element => {
            const key = element.getAttribute('data-i18n-value');
            if (this.translations[lang][key]) {
                element.value = this.translations[lang][key];
            }
        });

        // Обновляем FAQ ответы (особый случай)
        this.updateFAQAnswers(lang);
        
        // Сохраняем в localStorage
        localStorage.setItem('selectedLanguage', lang);
        
        console.log('MultiLanguage: Language change completed');
    }

    updateFAQAnswers(lang) {
        // Обновляем ответы FAQ, которые не имеют data-i18n
        const faqAnswers = [
            { selector: '.faq-item:nth-child(1) .faq-answer', key: 'faq_price_answer' },
            { selector: '.faq-item:nth-child(4) .faq-answer', key: 'faq_why_answer' }
        ];

        faqAnswers.forEach(({ selector, key }) => {
            const element = document.querySelector(selector);
            if (element && this.translations[lang][key]) {
                element.innerHTML = this.translations[lang][key];
            }
        });
    }

    updateAllSwitchers() {
        // Обновляем все переключатели языков
        const switchers = document.querySelectorAll('.language-option[data-lang]');
        const currentLangTexts = {
            'ru': 'RU',
            'en': 'EN', 
            'uk': 'UA'
        };

        switchers.forEach(switcher => {
            const lang = switcher.getAttribute('data-lang');
            
            // Удаляем класс active у всех
            switcher.classList.remove('active');
            
            // Добавляем класс active текущему языку
            if (lang === this.currentLang) {
                switcher.classList.add('active');
            }
            
            // Управляем видимостью в dropdown меню
            const parentDropdown = switcher.closest('.language-dropdown-menu');
            if (parentDropdown) {
                // В мобильном dropdown скрываем выбранный язык
                if (lang === this.currentLang) {
                    switcher.style.display = 'none';
                } else {
                    switcher.style.display = 'block';
                }
            } else {
                // В десктопной версии показываем все
                switcher.style.display = '';
            }
        });

        // Обновляем отображение текущего языка в мобильных dropdown
        const currentLangElements = document.querySelectorAll('#lang-current');
        currentLangElements.forEach(element => {
            element.textContent = currentLangTexts[this.currentLang];
        });

        console.log('MultiLanguage: Switchers updated');
    }

    // Метод для получения текущего языка
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Метод для получения перевода
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('MultiLanguage: DOM loaded, initializing...');
    window.multiLang = new MultiLanguage();
});
