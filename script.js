// Индикатор на линейке двигается вместе со скроллом страницы
const rulerIndicator = document.getElementById('rulerIndicator');

function updateRulerIndicator() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  const trackHeight = window.innerHeight;
  rulerIndicator.style.top = `${progress * trackHeight}px`;
}

window.addEventListener('scroll', updateRulerIndicator, { passive: true });
window.addEventListener('resize', updateRulerIndicator);
updateRulerIndicator();

// Плавное появление секций и карточек при скролле
const revealTargets = document.querySelectorAll('.case, .process-list li');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => revealObserver.observe(el));

// Подсветка активного пункта навигации по текущей секции
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[data-nav]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach((section) => navObserver.observe(section));
