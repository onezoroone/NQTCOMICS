import EditComic from '@/components/EditComic/EditComic';
import { fetchComicBySlug } from '@/libs/api/comics';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: {params: {slug: string}}): Promise<Metadata> {
    const data = await fetchComicBySlug(params.slug);
    const comic = data.comic;
    return {
        title: `${comic.title} - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
        openGraph: {
            title: `${comic.title} - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
        },
        robots: 'noindex, nofollow',
    }
}

async function Page({params}: {params: {slug: string}}) {
    const {slug} = params;
    const data = await fetchComicBySlug(slug);
    const genres = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/genres/v1/getGenres`)
    .then(res => res.json())
    .then(data => {
        return data;
    });
    return (  
        <EditComic data={data} genres={genres} />
    );
}

export default Page;