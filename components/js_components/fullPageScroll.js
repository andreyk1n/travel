// ---------------------------------------------------------------------------------------------------------------
// Функція повноекранного скроллу
// ---------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------
class FullpageScroll {
    constructor(options) {
        // ---------------------------------------------------------------------------------------------------------------
        // Налаштування за замовчуванням
        // ---------------------------------------------------------------------------------------------------------------

        // ---------------------------------------------------------------------------------------------------------------
        // дефолтні значення для всіх елементів без брекпоїнтів
        // ---------------------------------------------------------------------------------------------------------------

        this.defaultSettings = {
            enabled: true,
            scrollSpeed: 700,
            bullets: true,
            bulletPosition: 'right',
            sectionClass: 'fullpage'
        };

        // ---------------------------------------------------------------------------------------------------------------
        // Встановлюємо брекпоїнти
        // ---------------------------------------------------------------------------------------------------------------
        this.breakpoints = options.breakpoints || {};

        // ---------------------------------------------------------------------------------------------------------------
        // Зберігаємо основні налаштування
        // ---------------------------------------------------------------------------------------------------------------
        this.settings = { ...this.defaultSettings, ...options };

        this.init();
    }

    init() {
        this.updateSettings();
        if (!this.settings.enabled) {
            document.body.style.overflow = 'auto';
            return;
        }

        this.sections = document.querySelectorAll(`.${this.settings.sectionClass}`);
        this.currentSection = 0;

        this.createBullets();
        this.bindEvents();

        this.scrollToSection(this.currentSection);

        window.addEventListener('resize', () => this.updateSettingsOnResize());
    }

    updateSettings() {
        const width = window.innerWidth;
        let activeBreakpoint = this.defaultSettings;

        // ---------------------------------------------------------------------------------------------------------------
        // Знаходимо найближчий відповідний брекпоїнт
        // ---------------------------------------------------------------------------------------------------------------
        for (const breakpoint in this.breakpoints) {
            if (width <= breakpoint) {
                activeBreakpoint = { ...activeBreakpoint, ...this.breakpoints[breakpoint] };
                break;
            }
        }

        this.settings = activeBreakpoint;
    }

    updateSettingsOnResize() {
        this.updateSettings();

        if (!this.settings.enabled) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }

        this.createBullets();
        this.scrollToSection(this.currentSection);
    }

    createBullets() {
        if (!this.settings.bullets) return;

        let bulletContainer = document.querySelector('.fullpage-bullets');
        if (bulletContainer) {
            bulletContainer.remove();
        }

        bulletContainer = document.createElement('div');
        bulletContainer.className = 'fullpage-bullets';
        bulletContainer.style.position = 'fixed';


        switch (this.settings.bulletPosition) {
            case 'left':
                bulletContainer.style.left = '10px';
                bulletContainer.style.top = '50%';
                bulletContainer.style.transform = 'translateY(-50%)';
                bulletContainer.style.transform = 'rotate(90deg)';
                break;
            case 'top':
                bulletContainer.style.top = '10px';
                bulletContainer.style.left = '50%';
                bulletContainer.style.transform = 'translateX(-50%)';
                break;
            case 'right':
                bulletContainer.style.right = '10px';
                bulletContainer.style.top = '50%';
                bulletContainer.style.transform = 'translateY(-50%)';
                bulletContainer.style.transform = 'rotate(90deg)';
                break;
            case 'bottom':
            default:
                bulletContainer.style.bottom = '10px';
                bulletContainer.style.left = '50%';
                bulletContainer.style.transform = 'translateX(-50%)';
                break;
        }

        this.sections.forEach((_, index) => {
            const bullet = document.createElement('div');
            bullet.className = 'fullpage-bullet';
            bullet.dataset.index = index;
            bulletContainer.appendChild(bullet);
        });

        document.body.appendChild(bulletContainer);
        this.bullets = document.querySelectorAll('.fullpage-bullet');
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => this.handleKeyboard(e));
        window.addEventListener('wheel', (e) => this.handleMouseWheel(e));
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        if (this.settings.bullets) {
            this.bullets.forEach(bullet => {
                bullet.addEventListener('click', (e) => this.handleBulletClick(e));
            });
        }
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowDown') {
            this.nextSection();
        } else if (e.key === 'ArrowUp') {
            this.prevSection();
        }
    }

    handleMouseWheel(e) {
        if (e.deltaY > 0) {
            this.nextSection();
        } else if (e.deltaY < 0) {
            this.prevSection();
        }
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchEndY < this.touchStartY) {
            this.nextSection();
        } else if (touchEndY > this.touchStartY) {
            this.prevSection();
        }
    }

    handleBulletClick(e) {
        const index = parseInt(e.target.dataset.index, 10);
        this.scrollToSection(index);
    }

    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.scrollToSection(this.currentSection + 1);
        }
    }

    prevSection() {
        if (this.currentSection > 0) {
            this.scrollToSection(this.currentSection - 1);
        }
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;

        this.currentSection = index;
        const section = this.sections[index];

        const scrollElement = document.documentElement || document.body;
        const start = scrollElement.scrollTop;
        const end = section.offsetTop;
        const distance = end - start;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.settings.scrollSpeed, 1);
            scrollElement.scrollTop = start + distance * easeInOutQuad(progress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);

        if (this.settings.bullets) {
            this.bullets.forEach(b => b.classList.remove('active'));
            this.bullets[index].classList.add('active');
        }
    }
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ---------------------------------------------------------------------------------------------------------------
// Ініціалізація плагіна з брекпоїнтами
// ---------------------------------------------------------------------------------------------------------------
const fullpage = new FullpageScroll({
    // ---------------------------------------------------------------------------------------------------------------
    // тут треба вказати дані за замовчуванням -- вони мають бути такі самі
    // ---------------------------------------------------------------------------------------------------------------

    enabled: true,
    scrollSpeed: 100,
    bullets: true,
    bulletPosition: 'right',
    sectionClass: 'fullpage',
    // ---------------------------------------------------------------------------------------------------------------
    // брекпоїнти можна різні
    // ---------------------------------------------------------------------------------------------------------------
    breakpoints: {
        768: { enabled: false, scrollSpeed: 500, bullets: false },
        1024: { enabled: true, scrollSpeed: 1000, bullets: true, bulletPosition: 'top' }
    }
});