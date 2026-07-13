document.addEventListener('DOMContentLoaded', function() {
    const langDropdown = document.querySelector('.language-dropdown');
    const langCurrent = document.getElementById('lang-current');
    const langMenu = document.querySelector('.language-dropdown-menu');
    const langOptions = document.querySelectorAll('.language-option');
    const navWrapper = document.querySelector('.nav-links-wrapper');
    
    console.log('Language Switcher - Initial load');
    console.log('Lang Dropdown found:', !!langDropdown);
    console.log('Window width:', window.innerWidth);
    
    if (langDropdown && langCurrent && langMenu && navWrapper) {
        // Function to update visible options
        function updateVisibleOptions() {
            const currentLang = langCurrent.textContent.trim();
            console.log('Current language:', currentLang);
            
            // Update original dropdown options
            langOptions.forEach(option => {
                const optionText = option.textContent.trim();
                if (optionText === currentLang) {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            });
            
            // Update cloned dropdown options if they exist
            const clonedOptions = document.querySelectorAll('body > .language-dropdown .language-option');
            clonedOptions.forEach(option => {
                const optionText = option.textContent.trim();
                if (optionText === currentLang) {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            });
        }
        
        // Check if mobile version
        function isMobile() {
            return window.innerWidth <= 991;
        }
        
        // Move language dropdown to body on mobile
        function setupMobileDropdown() {
            if (isMobile()) {
                console.log('Setting up mobile dropdown - cloning to body');
                // Clone and move to body
                if (!document.querySelector('body > .language-dropdown')) {
                    const clone = langDropdown.cloneNode(true);
                    // Remove nav-link class that has padding meant for inline menu
                    clone.classList.remove('nav-link');
                    document.body.appendChild(clone);
                    console.log('Clone appended to body - cloned element exists:', !!document.querySelector('body > .language-dropdown'));
                    // Update references to cloned elements
                    const clonedDropdown = document.querySelector('body > .language-dropdown');
                    const clonedCurrent = clonedDropdown.querySelector('#lang-current');
                    const clonedMenu = clonedDropdown.querySelector('.language-dropdown-menu');
                    const clonedOptions = clonedDropdown.querySelectorAll('.language-option');
                    
                    // Copy current language text
                    clonedCurrent.textContent = langCurrent.textContent;
                    
                    // Setup click handler for cloned dropdown - click on the button/text
                    clonedCurrent.addEventListener('click', function(e) {
                        console.log('Lang current text clicked');
                        e.stopPropagation();
                        clonedDropdown.classList.toggle('active');
                        console.log('Active class toggled, current state:', clonedDropdown.classList.contains('active'));
                    });
                    
                    // Close when clicking outside
                    document.addEventListener('click', function closeDropdownOutside(e) {
                        if (!clonedDropdown.contains(e.target)) {
                            clonedDropdown.classList.remove('active');
                        }
                    });
                    
                    // Handle language selection on cloned dropdown
                    clonedOptions.forEach(option => {
                        option.addEventListener('click', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            const lang = this.getAttribute('data-lang');
                            const langText = this.textContent;
                            
                            // Update both original and cloned
                            langCurrent.textContent = langText;
                            clonedCurrent.textContent = langText;
                            
                            // Close dropdown
                            clonedDropdown.classList.remove('active');
                            
                            // Update visible options
                            updateVisibleOptions();
                            clonedOptions.forEach(opt => {
                                if (opt.textContent.trim() === langText) {
                                    opt.style.display = 'none';
                                } else {
                                    opt.style.display = 'block';
                                }
                            });
                            
                            console.log('Language switched to:', lang);
                            localStorage.setItem('selectedLanguage', lang);
                            
                            // Интеграция с системой мультиязычности
                            if (window.multiLang && window.multiLang.changeLanguage) {
                                window.multiLang.changeLanguage(lang);
                            }
                        });
                    });
                }
            } else {
                // Remove cloned dropdown on desktop
                const cloned = document.querySelector('body > .language-dropdown');
                if (cloned) {
                    console.log('Removing cloned dropdown on desktop');
                    cloned.remove();
                }
            }
        }
        
        // Mobile click handler
        function setupMobileHandler() {
            if (isMobile()) {
                setupMobileDropdown();
                // Don't attach to original - it's hidden on mobile
                // The cloned dropdown is handled inside setupMobileDropdown()
            } else {
                // Desktop hover events
                langDropdown.addEventListener('mouseenter', function() {
                    navWrapper.classList.add('language-expanded');
                });
                
                langDropdown.addEventListener('mouseleave', function() {
                    navWrapper.classList.remove('language-expanded');
                });
            }
        }
        
        // Initialize mobile handler
        setupMobileHandler();
        
        // Re-setup on window resize
        window.addEventListener('resize', function() {
            langDropdown.classList.remove('active');
            const cloned = document.querySelector('body > .language-dropdown');
            if (cloned) cloned.classList.remove('active');
            setupMobileHandler();
        });
        
        // Initialize visible options after a short delay
        setTimeout(() => {
            updateVisibleOptions();
        }, 100);
        
        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                const langText = this.textContent;
                
                // Update current language display
                langCurrent.textContent = langText;
                
                // Update cloned dropdown if exists
                const clonedCurrent = document.querySelector('body > .language-dropdown #lang-current');
                if (clonedCurrent) {
                    clonedCurrent.textContent = langText;
                }
                
                // Close dropdown on mobile
                if (isMobile()) {
                    langDropdown.classList.remove('active');
                    const cloned = document.querySelector('body > .language-dropdown');
                    if (cloned) cloned.classList.remove('active');
                }
                
                // Update visible options
                setTimeout(() => {
                    updateVisibleOptions();
                }, 50);
                
                // Here you can add actual language switching logic
                console.log('Language switched to:', lang);
                
                // Store preference
                localStorage.setItem('selectedLanguage', lang);
                
                // Интеграция с системой мультиязычности
                if (window.multiLang && window.multiLang.changeLanguage) {
                    window.multiLang.changeLanguage(lang);
                }
            });
        });
        
        // Load saved language preference or auto-detect browser language
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang) {
            const savedOption = document.querySelector(`[data-lang="${savedLang}"]`);
            if (savedOption) {
                langCurrent.textContent = savedOption.textContent;
                setTimeout(() => {
                    updateVisibleOptions();
                }, 100);
            }
        } else {
            // Auto-detect browser language
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
            const defaultOption = document.querySelector(`[data-lang="${detectedLang}"]`);
            if (defaultOption) {
                langCurrent.textContent = defaultOption.textContent;
                localStorage.setItem('selectedLanguage', detectedLang);
                setTimeout(() => {
                    updateVisibleOptions();
                }, 100);
            }
        }
    }
});
