class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;

        window.addEventListener('popstate', () => {
            this.handleRoute().catch(err => console.error(err));
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigateTo(route).catch(err => console.error(err));
            }
        });
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    async navigateTo(route) {
        if (this.routes[route]) {
            this.currentRoute = route;
            history.pushState({}, '', `#${route}`);
            this.updateActiveNav(route);
            try {
                const res = await this.routes[route]();
                return res;
            } catch (err) {
                console.error(`Error in route handler for '${route}':`, err);
            }
        } else {
            console.warn(`Route '${route}' not found`);
            await this.navigateTo('home');
        }
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        await this.navigateTo(hash);
    }

    updateActiveNav(activeRoute) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === activeRoute) {
                link.classList.add('active');
            }
        });
    }

    async init() {
        try {
            await this.handleRoute();
        } catch (err) {
            console.error(err);
        }
    }
}

window.router = new Router();