const postContainer = document.getElementById('post-container');

async function loadPosts() {
    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error("Erro ao carregar os posts:", error);
        return null;
    }
}

function getPostByTitle(posts, title) {
    return posts.find(post => post.title.toLowerCase().trim() === title.toLowerCase().trim()) || null;
}

async function displayPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postTitle = urlParams.get('title');

    if (postTitle) {
        const posts = await loadPosts();

        if (posts) {
            const post = getPostByTitle(posts, postTitle);

            if (post) {
                document.title = 'Quemeh - ' + post.title;

                // Atualização de metadados
                const metaKeyword = document.querySelector('meta[name="keywords"]');
                const metaAuthor = document.querySelector('meta[name="author"]');
                const metaDescription = document.querySelector('meta[name="description"]');
                const ogTitle = document.querySelector('meta[property="og:title"]');
                const ogDescription = document.querySelector('meta[property="og:description"]');
                const ogUrl = document.querySelector('meta[property="og:url"]');
                const ogImage = document.querySelector('meta[property="og:image"]');
                
                if (metaKeyword) metaKeyword.setAttribute('content', post.keywords || '');
                if (metaAuthor) metaAuthor.setAttribute('content', post.author || '');
                if (metaDescription) metaDescription.setAttribute('content', post.description || '');
                if (ogTitle) ogTitle.setAttribute('content', 'Quemeh - ' + post.title || '');
                if (ogDescription) ogDescription.setAttribute('content', post.description || '');
                if (ogUrl) ogUrl.setAttribute('content', window.location.href || '');
                if (ogImage) ogImage.setAttribute('content', `${window.location.origin}/images/${post.id}.png` || '');

                document.getElementById('post-link').href = post.link;
                document.getElementById('post-link').textContent = post.link_text;

                const article = document.createElement('article');
                article.classList.add('post', 'alternative');
                article.innerHTML = `
                    <img src="images/${post.id}.png" alt="${post.img_description}">
                    <h1>${post.title}</h1>
                    <h2>${post.subtitle}</h2>
                    <i class="bi bi-play-circle-fill" data-audio="${post.id}"></i>
                    <div class="wrapper">
                        <p>${post.content}</p>
                    </div>
                    <span>${post.date} - ${post.time} - ${post.author}</span>
                `;
                postContainer.appendChild(article);

                // Lógica do áudio
                const audioIcon = article.querySelector('.bi-play-circle-fill');
                let audio = null;
                let isPlaying = false;

                audioIcon.addEventListener('click', () => {
                    const audioId = audioIcon.dataset.audio;
                    if (!audio) {
                        audio = new Audio(`audios/${audioId}.mp3`);
                        audio.addEventListener('ended', () => {
                            isPlaying = false;
                            audioIcon.classList.remove('bi-pause-circle-fill');
                            audioIcon.classList.add('bi-play-circle-fill');
                        });
                    }

                    if (isPlaying) {
                        audio.pause();
                        audioIcon.classList.remove('bi-pause-circle-fill');
                        audioIcon.classList.add('bi-play-circle-fill');
                    } else {
                        audio.play();
                        audioIcon.classList.remove('bi-play-circle-fill');
                        audioIcon.classList.add('bi-pause-circle-fill');
                    }

                    isPlaying = !isPlaying;
                });

            } else {
                postContainer.innerHTML = "<p>Post não encontrado.</p>";
            }
        } else {
            postContainer.innerHTML = "<p>Erro ao carregar os posts.</p>";
        }
    } else {
        postContainer.innerHTML = "<p>Título do post não especificado na URL.</p>";
    }
}

displayPost();
