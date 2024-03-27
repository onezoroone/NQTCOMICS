"use client"
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import styles from './Swiper.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from "next/image";

export function MainCarousel({data}: {data: any}) {
    return (  
        <Swiper slidesPerView={1} className={styles.maincarousel} navigation={{
            nextEl: `.btn-slide-next-main`,
            prevEl: `.btn-slide-prev-main`,
            }} modules={[Navigation]}>
                {data.map((item: any, index: number)=>(
                <SwiperSlide key={index}>
                    <div className={styles.slidecover}>
                        <Image sizes="(max-width: 768px) 100vw, 100vw" fill={true} src={item.thumbnail} alt={item.title} style={{objectFit: "cover", filter:'blur(8px)'}} priority />
                    </div>
                    <div className={`h-full p-5 relative overflow-hidden flex items-center ${styles.contentslide}`}>
                        <div className={styles.leftmaincarousel}>
                            <h5 className="text-white font-bold text-lg">{item.chapter}</h5>
                            <Link href={item.slug}><h2 className="text-2xl" style={{fontWeight: '800'}}>{item.title}</h2></Link>
                            <div className={`${styles.descontent} text-white`}>
                            <div className="text-sm" dangerouslySetInnerHTML={{ __html: item.description.length > 250 ? `${item.description.substring(0, 250)}...` : item.description }} />
                            </div>
                            <div className={styles.slidecategory}>
                                {item.genres.map((genre: any, key: number)=>(
                                    <span key={key}>{genre.name}</span>
                                ))}
                            </div>
                            <div className="mt-5">
                                <Link href={item.slug} className={styles.slidebtnread}>Đọc Ngay</Link>
                            </div>
                        </div>
                        <div className={styles.centermaincarousel}>
                            <div className={styles.slideposter}>
                                <Link href={item.slug} className={styles.mangaposter}>
                                    <Image sizes="(max-width: 768px) 50vw, 60vw" fill={true} alt={item.title} className="manga-poster-img lazyload" src={item.thumbnail} />
                                </Link>
                            </div>
                        </div>
                        <div className={styles.rightmaincarousel}>
                            <div className="flex gap-2 h-full items-end justify-end">
                                <button className={`${styles.btnslideprev} btn-slide-prev-main`}><i className="bi bi-chevron-left"></i></button>
                                <button className={`${styles.btnslidenext} btn-slide-next-main`}><i className="bi bi-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                ))}
        </Swiper>
    );
}

export function CarouselTrending({data}: {data: any}) {
    return (
        <Swiper spaceBetween={20} slidesPerView={6} breakpoints={{
            0: {
                slidesPerView: 1,
            },
            350: {
                slidesPerView: 2,
            },
            580: {
                slidesPerView: 3,
            },
            770: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
            1400: {
                slidesPerView: 6,
            },
        }} navigation={{nextEl: `.btn-next-trending`, prevEl: `.btn-prev-trending`}} modules={[Navigation]}>
            {data.map((item: any,index: number)=>(
                <SwiperSlide key={index}>
                <div className={styles.item} title={item.title}>
                    <div className={styles.number}>
                        <span>{index+1}</span>
                        <div>{item.title}</div>
                    </div>
                    <div className="relative w-full">
                        <Image fill sizes="(max-width: 768px) 50vw, 60vw" src={item.thumbnail} alt={item.title} style={{objectFit:'cover'}} />
                        <div className={styles.hiddenitem}>
                            <h6 className="uppercase" style={{fontSize:'13px'}}>{item.title}</h6>
                            <div className="flex flex-1 flex-col">
                                <span><i className="bi bi-star-fill"></i>{item.rating != 0 ? item.rating : 'N/A'}</span>
                                <span><i className="bi bi-eye-fill"></i>{item.views}</span>
                                <span><i className="bi bi-file-earmark-text"></i>{item.chapter}</span>
                                <div className="flex-1 h-full flex items-end justify-center">
                                    <Link href={`/${item.slug}`} className={`${styles.slidebtnread} w-full justify-center flex items-center`} style={{fontSize:'14px'}}><i className="bi bi-eyeglasses" style={{marginRight:'5px'}}></i>Đọc ngay</Link>
                                </div>
                            </div>
                        </div>
                    </div>   
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
    );
}

export function Carousel({data}: {data: any}) {
    return (
        <Swiper spaceBetween={15} slidesPerView={8} navigation={{nextEl: `.btn-next-suggest`, prevEl: `.btn-prev-suggest`}} modules={[Navigation]} breakpoints={{
            0: {
                slidesPerView: 1,
            },
            350: {
                slidesPerView: 2,
            },
            500: {
                slidesPerView: 3,
            },
            708: {
                slidesPerView: 4,
            },
            800: {
                slidesPerView: 5,
            },
            992: {
                slidesPerView: 6,
            },
            1200: {
                slidesPerView: 7,
            },
            1400: {
                slidesPerView: 8,
            }
        }}>
                {data.map((item: any,index: number)=>(
                    <SwiperSlide key={index}>
                    <div className={styles.item1} title={item.title}>
                        <div className="relative w-full h-full overflow-hidden">
                            <Image height={210} width={170} src={item.thumbnail} alt={item.title} style={{objectFit:'cover', maxHeight:'210px', marginBottom:'5px'}} />
                            <div className={styles.hiddenitem}>
                                <h6 className="uppercase" style={{fontSize:'13px'}}>{item.title}</h6>
                                <div className="flex flex-1 flex-col">
                                    <span><i className="bi bi-star-fill"></i>{item.rating != 0 ? item.rating : 'N/A'}</span>
                                    <span><i className="bi bi-eye-fill"></i> {item.views}</span>
                                    <span><i className="bi bi-file-earmark-text"></i>{item.chapter}</span>
                                    <div className="flex-1 h-full flex items-end justify-center">
                                        <Link href={`/${item.slug}`} className={`${styles.slidebtnread} w-full justify-center flex`} style={{fontSize:'14px'}}><i className="bi bi-eyeglasses" style={{marginRight:'5px'}}></i>Đọc ngay</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Link href={`/${item.slug}`}><h6 className="font-bold">{item.title}</h6></Link>
                            <div className="text-sm" style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'#999'}}>
                                {item.genres.map((genre: any, key: number)=>(
                                    <span key={key}>{genre.name}, </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                ))}
        </Swiper>
    );
}