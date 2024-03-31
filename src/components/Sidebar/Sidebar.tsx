/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client"
import Link from "next/link";
import styles from "./sidebar.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function SidebarGuest({data, chapter, slug}: {data: any, chapter: string, slug: string}) {
    const [active, setActive] = useState(true);
    const chapterRefs = useRef((new Array(data.chapters.length)).fill(null));
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    useEffect(() => {
        if(data){
            if(isDropdownOpen){
                const reversedChapters = [...data.chapters].reverse();
                const currentChapterIndex = reversedChapters.findIndex(ch => ch.slug === chapter);
                if(currentChapterIndex !== -1){
                    chapterRefs.current[data.chapters.length - 1 - currentChapterIndex].scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, [isDropdownOpen]);
    const handleInputChange = (event: any) => {
        const reversedChapters = [...data.chapters].reverse();
        const foundChapterIndex = reversedChapters.findIndex(ch => ch.number === parseFloat(event.target.value));
        if (foundChapterIndex !== -1) {
            chapterRefs.current[data.chapters.length - 1 - foundChapterIndex]?.scrollIntoView({ behavior: 'smooth' });
        }else{
            chapterRefs.current[0]?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleActiveClick = () => {
        setActive(!active);
    };
    const handleImageLoad = () => {
        setIsLoading(false);
    };
    return (  
        <>
        <section className={`${styles.sidebar} ${!active ? styles.active : ''}`}>
            <div className={styles.head}>
                <Link href={`/`}><Image src="/logo.png" width={200} height={100} alt="logo" priority /></Link>
            </div>
            <div className={styles.headhidden}>
                <Link href={`/`}><Image src="/favicon.png" width={300} height={200} alt="logo" priority /></Link>
            </div>
            <div className={styles.bodysidebar}>
                <h5 className="text-white">{data.comic_name}</h5>
            </div>
            <div className={`${styles.dropdown} ${isDropdownOpen ? styles.active : ''}`} onClick={handleDropdownClick}>
                <span>{data && data.chapter_name}</span> <i className="bi bi-chevron-down"></i>
            </div>
            <div className={styles.navigation}>
                <Link onClick={(e) => {
                    if (chapter === data.chapters[data.chapters.length - 1].slug) {
                        e.preventDefault();
                    }}} 
                    style={chapter === data.chapters[data.chapters.length - 1].slug ? { pointerEvents: 'none', color: 'gray' } : {}}
                    href={`/${slug}/${
                        data.chapters.findIndex((ch: any) => ch.slug === chapter) < data.chapters.length - 1 
                            ? data.chapters[data.chapters.findIndex((ch: any) => ch.slug === chapter) + 1].slug 
                            : ''
                    }`}><i className="bi bi-arrow-left-short"></i>
                </Link>
                <Link onClick={(e) => {
                    if (chapter === data.chapters[0].slug) {
                        e.preventDefault();
                    }}} 
                    style={chapter === data.chapters[0].slug ? { pointerEvents: 'none', color: 'gray' } : {}}
                    href={`/${slug}/${
                        data.chapters.findIndex((ch: any) => ch.slug === chapter) > 0 
                            ? data.chapters[data.chapters.findIndex((ch: any) => ch.slug === chapter) - 1].slug 
                            : ''
                    }`}>
                    <i className="bi bi-arrow-right-short"></i>
                </Link>
            </div>
            <div className="flex-1 flex flex-col justify-end py-4 gap-2">
                <div className={styles.detail}>
                    <i className="bi bi-chat-left-dots" style={{fontSize:'43px'}}></i>
                    <div className="flex flex-col">
                        <h5>3</h5>
                        <h6>Bình Luận</h6>
                    </div>
                </div>
                <Link href={`/${slug}`} className={styles.info}>
                    <i className="bi bi-info"></i>
                    <h6 className="m-0">Thông tin truyện</h6>
                </Link>
                <div className={styles.toggle} onClick={handleActiveClick}>
                    <i className="bi bi-arrow-right-short"></i>
                </div>
            </div>
            {isDropdownOpen &&
            <div style={{position:'absolute', left:'100%', background:'#2f2f2f'}}>
                <div className="relative m-2 flex items-center" style={{background:'#3f3f3f', borderRadius:'5px', paddingLeft:'5px'}}>
                    <input autoComplete="off" className={styles.input} type="text" placeholder="Nhập số chương" onChange={handleInputChange} />
                    <button className={styles.button}><i className="bi bi-search"></i></button>
                </div>
                <ul className={styles.chapters}>
                    {data && data.chapters.map((item: any, index: number) => (
                        <li key={index} className={`${styles.chapter} ${chapter == item.slug ? styles.active : ''}`} ref={el => { chapterRefs.current[index] = el; }}>
                            <Link className="w-full" href={"/" + slug + "/" + item.slug}><i className="bi bi-caret-right-fill"></i><span>{item.chapter}</span></Link>
                        </li>
                    ))}
                </ul>
            </div>}
        </section>
        <main>
            <section className={`${styles.mainread} ${!active ? styles.active : ''}`}>
            {data && data.images.map((item: any, index: number) => (
                <div key={index}>
                    {isLoading && <div className="flex justify-center w-full"><Image className="m-5" src="/loading.gif" alt="loading" width={50} height={50} /></div>}
                    <img src={item.link} className={styles.lazyload} alt={item.name} onLoad={handleImageLoad} style={{ display: isLoading ? 'none' : 'inline-block' }} />
                </div>
            ))}
            <div className="w-full px-2" style={{maxWidth:'800px'}}>
                <section className={styles.navigationbottom}>
                    <Link onClick={(e) => {
                    if (chapter === data.chapters[data.chapters.length - 1].slug) {
                        e.preventDefault();
                    }}} 
                    style={chapter === data.chapters[data.chapters.length - 1].slug ? { pointerEvents: 'none', color: 'gray' } : {}}
                    href={`/${slug}/${
                        data.chapters.findIndex((ch: any) => ch.slug === chapter) < data.chapters.length - 1 
                            ? data.chapters[data.chapters.findIndex((ch: any) => ch.slug === chapter) + 1].slug 
                            : ''
                    }`}><i className="bi bi-arrow-left-short"></i><span>Chap trước</span></Link>
                    <Link onClick={(e) => {
                    if (chapter === data.chapters[0].slug) {
                        e.preventDefault();
                    }}} 
                    style={chapter === data.chapters[0].slug ? { pointerEvents: 'none', color: 'gray' } : {}}
                    href={`/${slug}/${
                        data.chapters.findIndex((ch: any) => ch.slug === chapter) > 0 
                            ? data.chapters[data.chapters.findIndex((ch: any) => ch.slug === chapter) - 1].slug 
                            : ''
                    }`}><span>Chap sau</span><i className="bi bi-arrow-right-short"></i></Link>
                </section>
            </div>
         </section>
        </main>
        </>
    );
}

export default SidebarGuest;