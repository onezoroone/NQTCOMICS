import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";
import { fetchComics } from "../../libs/api/comics";
import {Carousel, CarouselTrending, MainCarousel} from '../../components/Swiper/Swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import Ranking from "@/components/Ranking/Ranking";
import LayoutRoot from "@/app/(guest)/layoutGuest";
export default async function Home() {
    const data = await fetchComics();
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
            <main>
                <section style={{background: 'var(--background-main-2)'}}>
                    <div className={`${styles.containercarouselmain} container`} style={{padding:'30px 0'}}>
                        <MainCarousel data={data.comicsMostView} />
                    </div>
                </section>
                <section style={{background: 'var(--background-main-3)'}}>
                <div className="container">
                    <div className="py-5">
                        <div className="flex">
                            <h2 className="text-white mb-4 text-2xl font-bold">Trending</h2>
                            <div className="flex-1 flex gap-2 h-full relative justify-end">
                                <button className={`${styles.btnslideprev} btn-prev-trending text-white`} style={{background:'#4f4f4f', display:'block'}}><i className="bi bi-chevron-left"></i></button>
                                <button className={`${styles.btnslidenext} btn-next-trending text-white`} style={{background:'#4f4f4f', display:'block'}}><i className="bi bi-chevron-right"></i></button>
                            </div>
                        </div>
                        <CarouselTrending data={data.comicsMostVote} />
                        </div>
                    </div>
                </section>
            <section className="py-4" style={{background: '#1f1f1f'}}>
                <div className="container d-flex flex-column">
                    <div className={styles.listCategories}>
                        <Link href={`/tim-kiem-nang-cao?sort=update`} className={styles.itemcate} style={{background:'#d0e6a5'}}>
                            <i className="bi bi-lightning-charge-fill text-amber-600"></i> Mới Cập Nhật
                        </Link>
                        <Link href={`/tim-kiem-nang-cao?sort=new`} className={styles.itemcate} style={{background:'#ffdd95'}}>
                            <i className="bi bi-hand-index-thumb-fill text-yellow-500"></i> Truyện mới
                        </Link>
                        <Link href={`/tim-kiem-nang-cao?sort=views`} className={styles.itemcate} style={{background:'#ccabda'}}>
                            <i className="bi bi-fire text-warning text-red-500"></i> Được xem nhiều
                        </Link>
                        <Link href={`/tim-kiem-nang-cao?trang-thai=completed`} className={styles.itemcate} style={{background:'#abccd8'}}>
                            <i className="bi bi-check-square-fill text-green-700"></i> Hoàn thành
                        </Link>
                        {data.genres.map((genre: any)=>(
                            <Link href={`/tim-kiem-nang-cao?the-loai=${genre.slug}`} key={genre.id}>{genre.name}</Link>
                        ))}
                    </div>
                    <div className="mt-5">
                        <div className="flex">
                            <h2 className="text-white mb-4 font-bold text-2xl">Đề Cử</h2>
                            <div className="flex-1 flex gap-2 h-full justify-end">
                                <button className={`${styles.btnslideprev} btn-prev-suggest text-white`} style={{background:'#2f2f2f', display:'block'}}><i className="bi bi-chevron-left"></i></button>
                                <button className={`${styles.btnslidenext} btn-next-suggest text-white block`} style={{background:'#2f2f2f', display:'block'}}><i className="bi bi-chevron-right"></i></button>
                            </div>
                        </div>
                        <Carousel data={data.comicsMostRating} />
                    </div>
                    <div className="mt-10">
                        <div className="xl:flex">
                            <div className="w-full xl:w-8/12 mb-5">
                                <h3 className="text-white mb-4 font-bold text-2xl">Danh Sách Truyện</h3>
                                <section className={styles.listcomic}>
                                    {data.comics.map((item: any,index: number)=>(
                                    <div className="relative" title={item.title} key={index}>
                                        <div className="relative">
                                            <Link href={`/${item.slug}`}>
                                                <Image width={500} height={270} src={item.thumbnail} alt={item.title} />
                                            </Link>
                                            <span className={styles.views}><i className="bi bi-eye" style={{marginRight:'10px'}}></i>{item.views}</span>
                                        </div>
                                        <div className="text-center p-2 flex flex-col">
                                            <Link className="italic" href={`/${item.slug}`} style={{fontSize:'18px', fontWeight:'700'}}>
                                                {item.title}
                                            </Link>
                                            <Link href={`/${item.slug}`} className="mt-1 text-slate-400	" style={{fontSize:'14px'}}>
                                                <i className="bi bi-file-earmark-medical"></i> {item.chapter}
                                            </Link>
                                        </div>
                                        <span className={styles.updated}>{diffTime(item.updated_at)}</span>
                                    </div>
                                    ))}
                                </section>
                                <div className={styles.pagination}>
                                    <Link href="/tim-kiem-nang-cao">1</Link>
                                    <Link href="/tim-kiem-nang-cao">2</Link>
                                    <Link href="/tim-kiem-nang-cao">3</Link>
                                    <Link href="/tim-kiem-nang-cao"><i className="bi bi-chevron-right"></i></Link>
                                </div>
                            </div>
                            <div className="w-full xl:w-4/12">
                                <h3 className="text-white mb-4 font-bold text-2xl">Được Xem Nhiều</h3>
                                <Ranking dailyComics={data.dailyComics} weeklyComics={data.weeklyComics} monthlyComics={data.monthlyComics} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-4" style={{background: '#1f1f1f'}}>
                <div className="container">
                    <h2 className="text-white mb-4 font-bold text-2xl">Đang tiến hành</h2>
                    <Carousel data={data.comicsOnGoing} />
                </div>
        </section>
        </main>
        </LayoutRoot>
    );
}
