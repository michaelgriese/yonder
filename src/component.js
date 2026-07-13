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
    var html = await fetchContent();
    return Components.renderPage('Browse', Components.renderCard(html));
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

    static async viewPost(filename) {
        const escapeHtml = (s) => String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        if (!filename) {
            return Components.renderPage('Browse', Components.renderCard('<p>No post specified.</p>'));
        }

        try {
            const res = await fetch(`/content/posts/${encodeURIComponent(filename)}`);
            if (!res.ok) {
                return Components.renderPage('Not found', Components.renderCard('<p>Post not found.</p>'));
            }
            const post = await res.json();

            const meta = `
                <div class="post-meta">
                    <p> ${escapeHtml(post.author)} </br> ${escapeHtml(post.date)}</p>
                </div>
            `;
            const body = `<div class="post-body">${post.body || ''}</div>`;

            return Components.renderPage(escapeHtml(post.title || 'Post'), Components.renderCard(meta + body));
        } catch (err) {
            console.error(err);
            return Components.renderPage('Error', Components.renderCard('<p>Error loading post.</p>'));
        }
    }
}

async function fetchContent() {
    const res = await fetch('/api/posts');
    if (!res.ok) {
        console.error('Failed to fetch posts:', res.status, res.statusText);
        return formatPostList([]);
    }

    const postList = await res.json(); // array of filenames
    return formatPostList(postList);
}

function formatPostList(postJsons) {
    if (!Array.isArray(postJsons) || postJsons.length === 0) {
        return '<div class="file-list"><p>No files found.</p></div>';
    }

    const escapeHtml = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const items = postJsons.map(x => {
        const link = escapeHtml(x.name);
        const title = escapeHtml(x.title);
        const date = escapeHtml(x.date);

        // Link directly to the parameterized route
        return `<li class="file-list-item"><a href="#browse/${link}" data-filename="${link}" data-route="browse/${link}">${title}</a></li>`;
    }).join('');

    return `<div><ul class="file-list">${items}</ul></div>`;
}

window.Pages = Pages;