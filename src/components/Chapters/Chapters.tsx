/* eslint-disable @next/next/no-img-element */
"use client"
import Link from "next/link";
import { useRef } from "react";
import styles from './chapters.module.css';
import Image from "next/image";
function Chapters({data}: {data: any}) {
    const chapterRefs = useRef((new Array(data.chapters.length)).fill(null));
    const chapters = useRef<HTMLDivElement | null>(null);
    const handleInputChange = (event: any) => {
        const reversedChapters = [...data.chapters].reverse();
        const foundChapterIndex = reversedChapters.findIndex(ch => ch.number === parseFloat(event.target.value));
        if (foundChapterIndex !== -1) {
            if (chapters.current) {
                chapters.current.scrollTo({
                    top: chapterRefs.current[data.chapters.length - 1 - foundChapterIndex].offsetTop - 670,
                    behavior: 'smooth'
                });
            }
        } else {
            if (chapters.current) {
                chapters.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    };
    return (  
        <section style={{background:'var(--background-main-1)'}}>
            <div className="container">
                <div className={`${styles.contentmain} lg:flex py-20`}>
                    <div className="lg:w-9/12 w-full lg:pr-10">
                        <div className={styles.episodes}>
                            <div className={styles.headepisodes}>
                                Danh sách chương ({data.chapters[0].number} chương)
                                <div className={styles.searchepisode}>
                                    <div>
                                        <i className="bi bi-search"></i>
                                        <input className={styles.input} type="text" placeholder="Số chương" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.bodyepisodes} ref={chapters}>
                                {data.chapters && data.chapters.map((chapter: any, index: number) => (
                                    <div className={styles.itemepisode} key={index} ref={el => { chapterRefs.current[index] = el; }}>
                                        <div>
                                            <i className="bi bi-file-earmark-medical"></i>
                                            <span>{chapter.chapter}</span>
                                        </div>
                                        <div className="flex-1 flex justify-end">
                                            <Link href={`/${data.comic.slug}/${chapter.slug}`} className={styles.btnread}><i className="bi bi-sunglasses"></i>Đọc</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-3/12 w-full">
                        <h3 className="text-white font-bold text-2xl">Có Thể Bạn Sẽ Thích</h3>
                        <div className={styles.contentRanking}>
                            {data.related && data.related.map((item: any, index: number) => (
                            <div className={styles.itemRanking} key={index} title={item.title}>
                                <Link href={`/${item.slug}`}><Image width={70} height={90} className="rounded" src={item.thumbnail} alt={item.title} /></Link>
                                <div className={styles.bodycontentRanking}>
                                    <Link href={`/${item.slug}`}><h5 className="font-bold text-lg" style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.title}</h5></Link>
                                    <div className="w-100 text-sm text-slate-400" style={{fontSize:'15px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                        {item.genres.map((genre: any)=>(
                                            <span key={genre.slug}>
                                                <Link href={`/tim-kiem-nang-cao?the-loai=${genre.slug}`}>{genre.name}</Link>
                                                <span className={styles.dot}></span>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-1" style={{fontSize:'16px',color:'#3498db', lineHeight:'1.3'}}>
                                        <i className="bi bi-file-earmark-medical" style={{marginRight:'5px'}}></i>{item.chapter}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Chapters;