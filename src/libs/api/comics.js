export async function fetchComics() {
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getComics`, { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}

export async function fetchComicBySlug(slug) {
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getComic/${slug}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}

export async function fetchComicBySlugAndChapter(slug, chapter) {
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getImages/${slug}/${chapter}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}

export async function getFilter(){
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getFilter`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}