"use client"
import Link from "next/link";
import styles from "./ranking.module.css";
import { useState } from "react";
import Image from "next/image";
function Ranking({dailyComics, weeklyComics, monthlyComics } : {dailyComics: any, weeklyComics: any, monthlyComics: any}) {
    const [active, setActive] = useState(0);
    return (  
        <section className={styles.ranking}>
            <div className={styles.groupRanking}>
                <span onClick={() => setActive(0)} className={active == 0 ? styles.activeRanking : ''}>Ngày</span>
                <span onClick={() => setActive(1)} className={active == 1 ? styles.activeRanking : ''}>Tuần</span>
                <span onClick={() => setActive(2)} className={active == 2 ? styles.activeRanking : ''}>Tháng</span>
            </div>
            {active == 0 && (
            <div className={`${styles.contentRanking}`}>
                {dailyComics.map((item: any,index: number)=>(
                <div className={styles.itemRanking} key={index} title={item.title}>
                    <Link href={`/${item.slug}`}><Image width={70} height={100} src={item.thumbnail} alt={item.title} /></Link>
                    <div className={styles.bodycontentRanking}>
                        <Link href={`/${item.slug}`}><h5>{item.title}</h5></Link>
                        <div style={{fontSize:'15px'}}>
                            {item.genres.map((item: any)=>(
                                <span key={item.name}>
                                    <Link href={`/tim-kiem-nang-cao?the-loai=${item.slug}`}>{item.name}</Link>
                                    <span className={styles.dot}></span>
                                </span>
                            ))}
                        </div>
                        <div className="mt-1" style={{fontSize:'16px',color:'#3498db'}}>
                            <i className="bi bi-file-earmark-medical"></i>{item.chapter}
                        </div>
                    </div>
                    <div className={styles.endContentRanking}>
                        <div className={styles.numberRanking}>{index<9 && '0'}{index+1}</div>
                        <div className={styles.viewsRanking}>
                            {item.views}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
            {active == 1 && (
            <div className={styles.contentRanking}>
                {weeklyComics.map((item: any,index: number)=>(
                    <div className={styles.itemRanking} key={index} title={item.title}>
                    <Link href={`/${item.slug}`}><Image width={70} height={100} src={item.thumbnail} alt={item.title} /></Link>
                    <div className={styles.bodycontentRanking}>
                        <Link href={`/${item.slug}`}><h5>{item.title}</h5></Link>
                        <div style={{fontSize:'15px'}}>
                            {item.genres.map((genre: any)=>(
                                <span key={genre.name}>
                                    <Link href={`/tim-kiem-nang-cao?the-loai=${genre.slug}`}>{genre.name}</Link>
                                    <span className={styles.dot}></span>
                                </span>
                            ))}
                        </div>
                        <div className="mt-1" style={{fontSize:'16px',color:'#3498db'}}>
                            <i className="bi bi-file-earmark-medical"></i>{item.chapter}
                        </div>
                    </div>
                    <div className={styles.endContentRanking}>
                        <div className={styles.numberRanking}>{index<9 && '0'}{index+1}</div>
                        <div className={styles.viewsRanking}>
                            {item.views}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
            {active == 2 && (
            <div className={styles.contentRanking}>
                {monthlyComics.map((item: any,index: number)=>(
                    <div className={styles.itemRanking} key={index} title={item.title}>
                    <Link href={`/${item.slug}`}><Image width={70} height={100} src={item.thumbnail} alt={item.title} /></Link>
                    <div className={styles.bodycontentRanking}>
                        <Link href={`/${item.slug}`}><h5>{item.title}</h5></Link>
                        <div style={{fontSize:'15px'}}>
                            {item.genres.map((genre: any)=>(
                                <span key={genre.name}>
                                    <Link href={`/tim-kiem-nang-cao?the-loai=${genre.slug}`}>{genre.name}</Link>
                                    <span className={styles.dot}></span>
                                </span>
                            ))}
                        </div>
                        <div className="mt-1" style={{fontSize:'16px',color:'#3498db'}}>
                            <i className="bi bi-file-earmark-medical"></i>{item.chapter}
                        </div>
                    </div>
                    <div className={styles.endContentRanking}>
                        <div className={styles.numberRanking}>{index<9 && '0'}{index+1}</div>
                        <div className={styles.viewsRanking}>
                            {item.views}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </section>
    );
}

export default Ranking;