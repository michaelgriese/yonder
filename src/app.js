class App {
    constructor() {
        this.content = document.getElementById('content');
        this.setupRoutes();
        this.setupEventListeners();
    }

    setupRoutes() {
        router.addRoute('home', () => this.renderPage(Pages.home()));
        router.addRoute('about', () => this.renderPage(Pages.about()));
        router.addRoute('contact', () => this.renderPage(Pages.contact()));

        router.addRoute('browse', async () => {
            const res = await Pages.browse();
            this.renderPage(res);
        })
    }

    setupEventListeners() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        document.addEventListener('app:navigate', (e) => {
            router.navigateTo(e.detail.route);
        });
    }

    renderPage(html) {
        this.content.innerHTML = html;
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.updatePageTitle();
    }

    updatePageTitle() {
        const routeTitles = {
            'home': 'Home',
            'browse': 'Browse',
            'about': 'About',
            'contact': 'Contact'
        };

        document.title = routeTitles[router.currentRoute] || 'Home';
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = `${Components.renderLoading()} Sending...`;
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Message sent');
            form.reset();

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    init() {
        router.init();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
})

class EventBus {
    static emit(EventName, data = {}) {
        document.dispatchEvent(new CustomEvent(EventName, {detail: data}));
    }

    static on(eventName, callback) {
        document.addEventListener(eventName, callback);
    }
}

window.EventBus = EventBus;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}