class Components {
    static renderPage(title, content) {
        return `
            <div class="page">
                <h1>${title}</h1>
                ${content}
            </div>
        `;
    }

    static renderCard(content) {
        return `
            <div class="card">
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
            Components.renderCard('<p>Welcome to my website.</p>')
        );
    }

    static async browse() {
        var html = await fetchContent() 
        return Components.renderPage('Browse', Components.renderCard(html)); // I am getting html variable to be valid but shows up on DOM as undefined or promise
    }

    static about() {
        return Components.renderPage('About',
            Components.renderCard('<p>I am a pureblood human born May 15th, 21XX, Mars. My net-integrated brain stem allows for subconcious websurf. These are my thoughts.</p>')
        );
    }

    static contact() {
        return Components.renderPage('Contact',
            Components.renderCard('<p>Contact my website.</p>')
        );
    }
}

async function fetchContent() {
    const res = await fetch('/api/posts');
    if (!res.ok) {
        console.error('Failed to fetch posts:', res.status, res.statusText);
        return formatFileList([]);
    }
    const fileList = await res.json(); // array of filenames
    return formatFileList(fileList);
}

function formatFileList(filenames) {
    if (!Array.isArray(filenames) || filenames.length === 0) {
        return '<div class="file-list"><p>No files found.</p></div>';
    }

    const escapeHtml = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const items = filenames.map(name => {
        const safe = escapeHtml(name);
        return `<li><a href="#" data-filename="${safe}">${safe}</a></li>`;
    }).join('');

    return `<div class="file-list"><ul>${items}</ul></div>`;
}

window.Pages = Pages;