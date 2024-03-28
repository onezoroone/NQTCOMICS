import { cookies } from 'next/headers'

export async function fetchComics() {
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getComics`, { next: { revalidate: 900 } })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}

export async function fetchComicBySlug(slug) {
    const cookie = cookies().get('jwt');
    const token = cookie? cookie.value : undefined;
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getComic/${slug}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}

export function fetchComicBySlugAndChapter(slug, chapter) {
    const cookie = cookies().get('jwt');
    const token = cookie? cookie.value : undefined;
    return fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getImages/${slug}/${chapter}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}

export async function getFilter(){
    return await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/getFilter`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            throw new Error('Error:', error);
        });
}