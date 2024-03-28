import { fetchComicBySlug } from "@/libs/api/comics";
import Link from "next/link";
import styles from './detail.module.css';
import Image from "next/image";
import Chapters from "@/components/Chapters/Chapters";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from 'next';
import LayoutRoot from "@/app/(guest)/layoutGuest";
type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const data = await fetchComicBySlug(params.slug);
    if(data.status && data.status == "error"){
        notFound();
    }
    const previousImages = (await parent).openGraph?.images || []
    const comic = data.comic;
    return {
        title: `${comic.title} [Tới ${data.chapters[0].chapter}] Tiếng Việt | ${process.env.NEXT_PUBPIC_BASE_NAME}`,
        description: `Đọc truyện tranh ${comic.title} tiếng việt. Mới nhất nhanh nhất tại ${process.env.NEXT_PUBPIC_BASE_NAME}`,
        keywords: `${data.genres.map((genre: any) => genre.name).join(', ')}, ${comic.title}, ${comic.title} tiếng việt, đọc truyện ${comic.title}, truyện ${comic.title}`,
        openGraph: {
            title: `${comic.title} [Tới ${data.chapters[0].chapter}] Tiếng Việt | ${process.env.NEXT_PUBPIC_BASE_NAME}`,
            description: `Đọc truyện tranh ${comic.title} tiếng việt. Mới nhất nhanh nhất tại ${process.env.NEXT_PUBPIC_BASE_NAME}`,
            type: 'article',
            url: `${process.env.NEXT_PUBPIC_BASE_NAME}/${params.slug}`,
            locale: 'vi_VN',
            siteName: process.env.NEXT_PUBPIC_BASE_NAME,
            images: [`${process.env.NEXT_PUBPIC_BASE_URL}/_next/image?url=${comic.thumbnail}&w=640&q=75`, ...previousImages],
        },
    }
}

async function Detail({params}: Props) {
    const data = await fetchComicBySlug(params.slug);
    if(data.status && data.status == "error"){
        notFound();
    }
    const diffTime = (date: string) => {
        const currentDate = new Date();
        const updatedDate = new Date(date);
        const diff = currentDate.getTime() - updatedDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        if(days > 0){
            return `${days} ngày trước`;
        }else if(hours > 0){
            return `${hours} giờ trước`;
        }else if(minutes > 0){
            return `${minutes} phút trước`;
        }else{
            return `${seconds} giây trước`;
        }
    }
    return (  
        <LayoutRoot>
        <section style={{background: '#2f2f2f', color:'#fff'}}>
            <div className="container">
                <div className="py-20">
                    <div className="xl:flex">
                        <div className="xl:w-2/12 w-full flex justify-center mb-3">
                            <Image width={224} height={338} src={data.comic.thumbnail} className="rounded" style={{objectFit:'cover', border:'5px solid #fff', maxHeight: '338px'}} alt={data.comic.title} />
                        </div>
                        <div className={`${styles.centercontent} xl:w-7/12 w-full px-3 mb-4`}>
                            <h2 className="font-bold text-center xl:text-start text-2xl italic mb-2">{data.comic.title}</h2>
                            <div className={`${styles.genres} text-sm justify-center xl:justify-start`}>
                                {data.genres.map((genre: any, index: number) => (
                                    <Link href={`/tim-kiem-nang-cao?the-loai=${genre.slug}`} key={index} className={styles.genre}>{genre.name}</Link>
                                ))}
                            </div>
                            <div className="text-sm text-center xl:text-start" dangerouslySetInnerHTML={{ __html: data.comic.description }} />
                            <div className={`${styles.totalIndex} justify-center xl:justify-start`}>
                                <span className="mr-3"><i className="bi bi-eye-fill" style={{color:'#0ea5e9'}}></i>{data.comic.views}</span>
                                <span className="mr-3"><i className="bi bi-bookmark-check-fill" style={{color:'green'}}></i>{data.comic.votes}</span>
                            </div>
                            <div className="mt-3 flex gap-1 xl:justify-start justify-center">
                                <Link href={`/${params.slug}/${data.chapters[0].slug}`} className={styles.btn}><i className="bi bi-eye-fill"></i>Đọc Ngay</Link>
                                <Link href={`/${params.slug}/${data.chapters[data.chapters.length - 1].slug}`} className={styles.btn}><i className="bi bi-eye-fill"></i>Đọc Từ Đầu</Link>
                                <Link href={`/`} className={styles.btnFollow}><i className="bi bi-bookmark-fill"></i>Theo Dõi</Link>
                            </div>
                        </div>
                        <div className={`xl:w-3/12 w-full flex flex-col gap-1`}>
                            <div className="flex flex-col gap-1 items-center xl:items-start">
                                <div className="fs-6" style={{fontWeight:'600'}}>
                                    Tác giả: <span style={{color :'#d946ef'}}>{data.comic.authors}</span>
                                </div>
                                <div className="fs-6" style={{fontWeight:'600'}}>
                                    Nhóm dịch: <span style={{color :'#d946ef'}}>{data.comic.translators ? data.comic.translators : 'Đang cập nhật'}</span>
                                </div>
                                <div className="fs-6" style={{fontWeight:'600'}}>
                                    Trạng thái: {data.comic.status}
                                </div>
                                <div className="fs-6" style={{fontWeight:'600'}}>
                                Cập nhật lần cuối: {diffTime(data.comic.updated_at)}
                            </div>
                            </div>
                            <div className="mt-4 flex justify-center w-full">
                                <div className="max-w-xl w-full">
                                    <div className="p-3" style={{background:'#4693B8', borderRadius:'10px 10px 0 0'}}>
                                        <div className="flex items-center">
                                            <div className="flex gap-2" style={{fontSize:'18px'}}>
                                                <i className="bi bi-star-fill text-yellow-500"></i>
                                                <span>3.46<span style={{fontWeight: '900'}}>/</span>5</span> <span style={{fontSize:'12px'}}>(200 voted)</span>
                                            </div>
                                            <div className="flex-1 flex justify-end" style={{fontWeight:'700', fontSize:'16px'}}>
                                            Vote Now
                                            </div>
                                        </div>
                                        <div className="text-center mt-3">Đánh giá của bạn với truyện này!</div>
                                    </div>
                                    <div className={styles.emoji} style={{background:'#fff', color:'#f0c357', borderRadius:'0 0 10px 10px', fontSize:'30px', display:'grid', gridTemplateColumns:'repeat(3,1fr)'}}>
                                        <div className="flex flex-col gap-2">
                                            😩<span className="text-dark" style={{fontSize:'16px'}}>Chán òm</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            😃<span className="text-dark" style={{fontSize:'16px'}}>Hay</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            🤩<span className="text-dark" style={{fontSize:'16px'}}>Tuyệt vời</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
        </section>
        <Chapters data={data} />
        </LayoutRoot>
    );
}

export default Detail;