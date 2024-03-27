import { fetchComicBySlugAndChapter } from "@/libs/api/comics";
import { notFound } from "next/navigation";
import styles from './readcomic.module.css';
import { HeaderRead } from "@/components/Header/Header";
import SidebarGuest from "@/components/Sidebar/Sidebar";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { slug: string, chapter: string}
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const data = await fetchComicBySlugAndChapter(params.slug, params.chapter);
    if(data.status && data.status == "error"){
        notFound();
    }
    const previousImages = (await parent).openGraph?.images || []
    return {
        title: `${data.comic_name} - ${data.chapter_name} Tiếng Việt`,
        description: `Đọc truyện tranh ${data.comic_name + ' ' + data.chapter_name + ' tiếng việt. Mới nhất nhanh nhất tại ' + process.env.NEXT_PUBPIC_BASE_NAME}`,
        keywords: `${data.comic_name}, ${data.comic_name} tiếng việt, đọc truyện ${data.comic_name}, truyện ${data.comic_name}`,
        openGraph: {
            title: `${data.comic_name} - ${data.chapter_name} Tiếng Việt`,
            description: `Đọc truyện tranh ${data.comic_name + ' ' + data.chapter_name + ' tiếng việt. Mới nhất nhanh nhất tại ' + process.env.NEXT_PUBPIC_BASE_NAME}`,
            type: 'article',
            url: `${process.env.NEXT_PUBPIC_BASE_NAME}/${params.slug}/${params.chapter}`,
            locale: 'vi_VN',
            siteName: process.env.NEXT_PUBPIC_BASE_NAME,
            images: [`/_next/image?url=${data.thumbnail}&w=640&q=75`, ...previousImages],
        },
    }
}

async function ReadComic({params}: {params: {slug: string, chapter: string}}) {
    const {slug, chapter} = params;
    const data = await fetchComicBySlugAndChapter(slug, chapter);
    if(data.status && data.status == "error"){
        notFound();
    }
    return (
        <div>
            <HeaderRead data={data} slug={params.slug} chapter={params.chapter} />
            <div id="top"></div>
            <SidebarGuest data={data} slug={params.slug} chapter={params.chapter} />
            <Link href="#top" className={styles.uptop}>
                <i className="bi bi-chevron-up"></i>
            </Link>
        </div>
    );
}

export default ReadComic;