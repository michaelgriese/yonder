class Components {
    static renderPage(title, content) {
        return `
            <div class="page">
                <h1>${title}</h1>
                ${content}
            </div>
        `;
    }

    static renderCard(title, content) {
        return `
            <div class="card">
                <h2>${title}</h2>
                <div>${content}</div>
            </div>
        `;
    }

    static renderLoading() {
        return '<div class="loading"></div>'
    }
}

class Pages {
    static home() {
        return Components.renderPage('Home',
            Components.renderCard('Welcome', '<p>Welcome to my website.</p>')
        );
    }

    static about() {
        return Components.renderPage('About',
            Components.renderCard('About', '<p>About my website.</p>')
        );
    }

    static contact() {
        return Components.renderPage('Contact',
            Components.renderCard('Contact', '<p>Contact my website.</p>')
        );
    }
}

window.Pages = Pages;