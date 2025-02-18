const container = document.getElementById('posts-container');
const postsPerPage = 12;
let allPosts = [];
let filteredPosts = [];

async function loadPosts() {
    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        allPosts = data.reverse();
        filteredPosts = allPosts;
        createPosts();
    } catch (error) {
        console.error("Erro ao carregar os posts:", error);
        container.innerHTML = "<p>Erro ao carregar os posts.</p>";
    }
}

async function createPosts() {
    const urlParams = new URLSearchParams(window.location.search);
    let page = parseInt(urlParams.get('page')) || 1;
    let searchQuery = urlParams.get('search') || localStorage.getItem('searchQuery') || "";

    filteredPosts = searchQuery ? allPosts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase())) : allPosts;

    if (filteredPosts.length === 0 && searchQuery) {
        filteredPosts = allPosts;
    }

    const posts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);
    container.innerHTML = '';

    if (posts.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'Nenhum post encontrado.';
        container.appendChild(noResultsMessage);
    } else {
        posts.forEach(post => {
            const description = post.description.length > 100 ? post.description.substring(0, 150) + '...' : post.description;
            const article = document.createElement('article');
            article.classList.add('post');
            article.innerHTML = `
                <img src="images/${post.id}.png" alt="${post.img_description}">
                <h1>${post.title}</h1>
                <h2>${post.subtitle}</h2>
                <div class="wrapper">
                    <p>${description}</p>
                </div>
                <span>${post.date} - ${post.time} - ${post.author}</span>
                <a href="article.html?title=${post.title}&id=${post.id}" aria-label="Saiba mais sobre a postagem ${post.title}">Continuar lendo</a>
            `;
            container.appendChild(article);
        });
    }

    createPagination(page, searchQuery);
}

function createPagination(currentPage, searchQuery) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    if (filteredPosts.length === 0) {
        pagination.style.display = 'none';
        return;
    } else {
        pagination.style.display = 'flex';
    }

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }

    const previousButton = document.createElement('a');
    previousButton.href = currentPage === 1 ? '#' : `?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}`;
    previousButton.classList.add('button');
    previousButton.textContent = 'Anterior';
    previousButton.setAttribute('aria-label', 'Página anterior');

    if (currentPage === 1) {
        previousButton.style.display = 'none';
    } else {
        previousButton.setAttribute('aria-disabled', 'false');
    }
    pagination.appendChild(previousButton);

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('a');
        pageButton.href = `?page=${i}${searchQuery ? `&search=${searchQuery}` : ''}`;
        pageButton.classList.add('button');
        pageButton.textContent = i;
        pageButton.setAttribute('aria-label', `Ir para a página ${i}`);

        if (i === currentPage) {
            pageButton.classList.add('current');
            pageButton.setAttribute('aria-current', 'page');
        }

        pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement('a');
    nextButton.href = currentPage === totalPages ? '#' : `?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}`;
    nextButton.classList.add('button');
    nextButton.textContent = 'Próxima';
    nextButton.setAttribute('aria-label', 'Próxima página');

    if (currentPage === totalPages) {
        nextButton.style.display = 'none';
    } else {
        nextButton.setAttribute('aria-disabled', 'false');
    }
    pagination.appendChild(nextButton);
}

function addSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const lastSearchQuery = localStorage.getItem('searchQuery') || '';
    searchInput.value = lastSearchQuery;

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('search', query);
        urlParams.set('page', 1);
        history.pushState(null, '', '?' + urlParams.toString());
        localStorage.setItem('searchQuery', query);
        
        createPosts();
        if (query.length === 0) {
            createPosts();
        }
    });
}

addSearchFunctionality();
loadPosts();
