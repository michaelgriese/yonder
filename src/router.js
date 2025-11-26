class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;

        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigateTo(route);
            }
        });
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigateTo(route) {
        if (this.routes[route]) {
            this.currentRoute = route;
            history.pushState({}, '', `#${route}`);
            this.updateActiveNav(route);
            this.routes[route]();
        } else {
            console.warn(`Route '${route}' not found`);
            this.navigateTo('home');
        }
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateTo(hash);
    }

    updateActiveNav(activeRoute) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === activeRoute) {
                link.classList.add('active');
            }
        });
    }

    init() {
        this.handleRoute();
    }
}

window.router = new Router();