import ListChapters from "@/components/ListChapters/ListChapters";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: {params: {slug: string}}): Promise<Metadata> {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/chapters/v1/getChapters/${params.slug}`, {
        cache: "no-store",
    })
    .then(res => res.json())
    .then(data => data)
    return {
        title: `${data.comic.title} - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
        openGraph: {
            title: `${data.comic.title} - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
        },
        robots: 'noindex, nofollow',
    }
}

async function Page({params}: {params: {slug: string}}) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/chapters/v1/getChapters/${params.slug}`, {
        cache: "no-store",
    })
    .then(res => res.json())
    .then(data => data)
    return (  
        <ListChapters chapters={data.chapters} comic={data.comic} />
    );
}

export default Page;