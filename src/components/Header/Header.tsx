/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Link from "next/link";
import styles from "./header.module.css";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Dialog } from 'primereact/dialog';
import axiosClient from "@/libs/axiosClient";

function HeaderGuest() {
    const [active, setActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [login, setLogin] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [activeProfile, setActiveProfile] = useState(false);
    useEffect(() => {
        setSearchResults([]);
        setSearchTerm('');
        if(localStorage.getItem('token')) setLogin(true);
        if(localStorage.getItem('theme')){
            if(localStorage.getItem('theme') === 'dark'){
                document.documentElement.classList.add('dark');
                setIsDark(true);
            }else{
                document.documentElement.classList.remove('dark');
                setIsDark(false);
            }
        }else{
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, [pathname]);
    const handleInputChange = (event: any) => {
        setSearchTerm(event.target.value);
        if (timer) {
          clearTimeout(timer);
        }
        if(event.target.value.length < 2) setSearchResults([]);
        if(event.target.value.length >= 2) {
            const newTimer = setTimeout(() => {
                setIsLoading(true);
                handleSearch(event.target.value);
            }, 500);
            setTimer(newTimer);
        }
    };
    const handleSearch = async (keyword: string) => {
        await fetch(process.env.NEXT_PUBLIC_BASE_API_URL + "/api/comics/v1/search?keyword=" + keyword)
        .then((res: Response) => {
            return res.json();
        })
        .then((data: any) => {
            setSearchResults(data);
        })
        .catch((err: Error) => {
            console.log(err);
        });
        setIsLoading(false);
    };
    const handleLogin = async (e: any) => {
        e.preventDefault();
        if(email === '' || password === '') alert('Vui lòng nhập đầy đủ thông tin')
        else{
            // await axiosClient.post("/api/auth/v1/login", {
            //    email, password
            // },{
            //     withCredentials: true,
            // })
            await axiosClient.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/api/auth/v1/login", {
                params: {
                    email, password
                }
            })
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                setVisible(false);
                setLogin(true);
            })
            .catch(() => {
                alert('Thông tin tài khoản hoặc mật khẩu không chính xác');
            });
        }
    }
    const handleSignUp = async (e: any) => {
        e.preventDefault();
        if(email === '' || password === '' || name === '' || confirmPassword === '') alert('Vui lòng nhập đầy đủ thông tin')
        else if(password !== confirmPassword) alert('Mật khẩu không trùng khớp')
        else{
            // await axiosClient.post("/api/auth/v1/signup", {
            //    email, password, name, confirmPassword
            // })
            await axiosClient.get(process.env.NEXT_PUBLIC_BASE_API_URL + "/api/auth/v1/signup", {
                params: {
                    email, password, name, confirmPassword
                }
            })
            .then(() => {
                alert('Đăng ký thành công.');
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
            })
            .catch(() => {
                alert('Email đã có người sử dụng.');
            });
        }
    }
    const handleChangeTheme = () => {
        if(isDark){
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        }else{
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    }
    return (  
        <header className={styles.header}>
            <div className="container flex items-center h-max">
                {/* <div className={styles.togglesidebar}><i className="bi bi-list fs-1"></i></div> */}
                <Link href="/">
                    <Image width={170} height={50} src="/logo.png" alt="logo" priority />
                    <div className="clear-none"></div>
                </Link>
                <ul className={styles.menu}>
                    <li><Link href="/tim-kiem-nang-cao?trang-thai=completed">Hoàn Thành</Link></li>
                    <li><Link href={`/`}>Kiểu</Link></li>
                    <li><Link href="/tim-kiem-nang-cao">Tìm Truyện</Link></li>
                </ul>
                <div className={`${styles.userlogged} flex-1 flex justify-end`}>
                    <div className={styles.search}>
                        <div className={`relative ${styles.searchcontent}`}>
                            <form className={styles.formsearch} action="/tim-kiem-nang-cao" autoComplete="off">
                                <Link className={styles.filtericon} href="/tim-kiem-nang-cao">LỌC</Link>
                                <input className={`${styles.searchinput}`} name="name" autoComplete="off" value={searchTerm} onChange={handleInputChange} placeholder="Tìm kiếm..." type="text" />
                                <button className={styles.searchicon} type="submit">
                                {isLoading ? (
                                <svg className="animate-spin h-5 w-5 border-4 rounded-full border-black border-b-white" viewBox="0 0 24 24"></svg>
                                ) : (
                                <i className="bi bi-search" style={{fontSize:'15px'}}></i>
                                )}
                                </button>
                            </form>
                            <div className={`${styles.searchresult} ${searchResults ? '' : 'visually-hidden'}`}>
                                <ul className="list-group w-full rounded-lg bg-white absolute" style={{top:'100%', zIndex:'100'}}>
                                    {searchResults.length != 0 && searchResults.map((item: any, index : number) => (
                                        <li key={index} className="flex items-center p-2 gap-2" title={item.title}>
                                            <Link href={`/${item.slug}`}><Image src={item.thumbnail} width={70} height={100} alt={item.title} /></Link>
                                            <Link href={`/${item.slug}`}>{item.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styles.toggle} onClick={() => setActive(!active)}><i className={`${styles.custom} bi bi-search`}></i></div>
                    {!isDark ? <i onClick={handleChangeTheme} className="bi bi-moon-fill mr-2 lg:ml-0 ml-2 text-3xl cursor-pointer"></i> : <i onClick={handleChangeTheme} className="bi bi-brightness-high-fill mr-2 lg:ml-0 ml-2 text-3xl cursor-pointer"></i>}
                    <div id="login-state" className="float-left">
                        <div id="user-slot">
                            <div className="header_right-user logged">
                                {!login ? <button onClick={() => setVisible(true)} className={`${styles.btnuser} btn btn-login`}><i className="bi bi-person-circle" style={{marginRight:'5px'}}></i><span>Đăng Nhập</span></button> :
                                <div className="relative">
                                    <i className="bi bi-person-circle text-3xl cursor-pointer" onClick={() => setActiveProfile(!activeProfile)}></i>
                                    {activeProfile && 
                                    <div className="absolute w-32 bg-cyan-400 z-10 px-2 right-0 select-none">
                                        <ul className="list-group">
                                            <li className="py-1"><Link href="/">Hồ sơ</Link></li>
                                            <li className="py-1"><Link href="/">Đã xem</Link></li>
                                            <li className="py-1"><Link href="/">Đã theo dõi</Link></li>
                                            <li className="py-1"><Link href="/">Đăng xuất</Link></li>
                                        </ul>
                                    </div>}
                                </div>
                                }
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <Dialog visible={visible} modal onHide={() => setVisible(false)}
                        content={({ hide }) => (
                        <div className="flex flex-col px-8 py-5 gap-4 rounded-xl bg-white dark:bg-main2">
                            <div className="flex justify-center w-full"><Image src="/logo1.png" alt="logo" width={200} height={100} /></div>
                            <form onSubmit={handleLogin} className="flex flex-col gap-4" autoComplete="off">
                                <input type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputform} placeholder="Nhập email" />
                                <input type="password" value={password} autoComplete="off" onChange={(e) => setPassword(e.target.value)} className={styles.inputform} placeholder="Nhập mật khẩu" />
                                <div className="flex items-center gap-2">
                                    <button type="submit" className={styles.buttonform}>Đăng nhâp</button>
                                    <button className={styles.buttonform} type="button" onClick={(e) => hide(e)}>Đóng</button>
                                </div>
                            </form>
                            <div className="w-full text-center">
                                <span className="text-slate-400">Chưa có tài khoản?</span> <span onClick={(e) => {hide(e); setVisible1(true)}} className="cursor-pointer hover:text-slate-400">Đăng ký ngay</span>
                            </div>
                        </div>)}>  
                        </Dialog>
                        <Dialog visible={visible1} modal onHide={() => setVisible1(false)} 
                        content={({ hide }) => (
                            <div className="flex flex-col px-8 py-5 gap-4 rounded-xl bg-white dark:bg-main2">
                                <div className="flex justify-center w-full"><Image src="/logo1.png" alt="logo" width={200} height={100} /></div>
                                <form onSubmit={handleSignUp} className="flex flex-col gap-4" autoComplete="off">
                                    <input type="text" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} className={styles.inputform} placeholder="Nhập tên" />
                                    <input type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputform} placeholder="Nhập email" />
                                    <input type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputform} placeholder="Nhập mật khẩu" />
                                    <input type="password" autoComplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.inputform} placeholder="Nhập lại mật khẩu" />
                                    <div className="flex items-center gap-2">
                                        <button type="submit" className={styles.buttonform}>Đăng ký</button>
                                        <button className={styles.buttonform} type="button" onClick={(e) => hide(e)}>Đóng</button>
                                    </div>
                                </form>
                                <div className="w-full text-center">
                                    <span className="text-slate-400">Đã có tài khoản? </span><span onClick={(e) => {hide(e); setVisible(true)}} className="cursor-pointer hover:text-slate-400">Đăng nhập ngay</span>
                                </div>
                            </div>)}>
                        </Dialog>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
            <div className={`${styles.searchmobile} ${!active ? 'invisible' : ""}`} style={{zIndex:'10'}}>
                <div className={`relative ${styles.searchcontent}`}>
                    <form action="/tim-kiem-nang-cao" className={`${styles.formsearch} w-full`} autoComplete="off">
                        <Link className={styles.filtericon} href="/tim-kiem-nang-cao">LỌC</Link>
                        <input autoComplete="off" className={`${styles.searchinput}`} name="name" value={searchTerm} onChange={handleInputChange} placeholder="Tìm kiếm..." type="text" />
                        <button className={styles.searchicon} type="submit">
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 border-4 rounded-full border-black border-b-white" viewBox="0 0 24 24"></svg>
                            ) : (
                            <i className="bi bi-search" style={{fontSize:'15px'}}></i>
                        )}
                        </button>
                    </form>
                    {searchResults.length != 0 && (
                    <div className={`${styles.searchresult} ${searchResults ? '' : 'visually-hidden'}`}>
                        <ul className="list-group absolute w-full p-2 rounded-lg mt-1 bg-white" style={{top:'100%'}}>
                            {searchResults.map((item: any, index: number) => (
                                <li key={index} className="flex items-center gap-2" title={item.title}>
                                    <Image src={item.thumbnail} width={70} height={100} alt={item.title} />
                                    <Link href={`/${item.slug}`}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default HeaderGuest;

export function HeaderRead({data, chapter, slug} : {data: any, chapter: any, slug: string}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const chapterRefs = useRef((new Array(data.chapters.length)).fill(null));
    const [scrollPosition, setScrollPosition] = useState(0);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);
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
    useEffect(() => {
        const handleScroll = () => {
            setLastScrollPosition(scrollPosition);
            setScrollPosition(window.pageYOffset);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollPosition]);
    useEffect(() => {
        const isScrollingUp = scrollPosition < lastScrollPosition;
        setIsVisible(isScrollingUp);
    }, [lastScrollPosition, scrollPosition]);
    const handleInputChange1 = (event: any) => {
        const reversedChapters = [...data.chapters].reverse();
        const foundChapterIndex = reversedChapters.findIndex(ch => ch.number === parseFloat(event.target.value));
        if (foundChapterIndex !== -1) {
            chapterRefs.current[data.chapters.length - 1 - foundChapterIndex]?.scrollIntoView({ behavior: 'smooth' });
        } else {
            chapterRefs.current[0]?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleDropdownClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <header className={styles.headerread} style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
            <div className={styles.left}>
                <Link href="/"><Image src="/logo.png" className={styles.brand} fill  alt="logo" sizes="(max-width:500px) 100px, 200px" priority /></Link>
                <Link href="/"><Image fill sizes="(max-width:500px) 50px, 70px" style={{borderRight: '1px solid #333'}} src="/logo1.png" className={styles.logo} alt="logo" priority /></Link>
            </div>
            <div className={styles.center}>
                <h5>{data && data.comic_name}</h5>
                <div className="flex gap-2 items-center">
                    <div className={`${styles.dropdownheader}`} onClick={handleDropdownClick}>
                        <span>{data && data.chapter_name}</span> <i className="bi bi-chevron-down"></i>
                    </div>
                    {data && <div className={styles.navigationheader}>
                        <Link onClick={(e) => {
                            if (chapter === data.chapters[data.chapters.length - 1].slug) {
                                e.preventDefault();
                            }}} 
                            style={chapter === data.chapters[data.chapters.length - 1].slug ? { pointerEvents: 'none', color: 'gray' } : {}}
                            href={`/${slug}/${
                                data.chapters.findIndex((ch: any) => ch.slug === chapter) < data.chapters.length - 1 
                                    ? data.chapters[data.chapters.findIndex((ch: any) => ch.slug === parseInt(chapter)) + 1].slug 
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
                            }`}><i className="bi bi-arrow-right-short"></i>
                        </Link>
                    </div>}
                </div>
                {isDropdownOpen &&
                <div className={styles.submenuheader}>
                    <div className="m-2 relative flex items-center rounded-2" style={{background:'#444', paddingLeft:'5px'}}>
                        <input autoComplete="off" className={styles.input} type="text" placeholder="Nhập số chương" onChange={handleInputChange1} />
                        <button className={styles.button}><i className="bi bi-search"></i></button>
                    </div>
                    <ul className={styles.chaptersheader}>
                        {data && data.chapters.map((item: any, index: number) => (
                            <li key={index} className={`text-sm ${chapter == item.slug ? styles.active : ''}`} ref={el => { chapterRefs.current[index] = el; }}>
                                <Link className="w-full" href={"/" + slug + "/" + item.slug}>{item.chapter}</Link>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
            <div className={styles.right}>
                <div>
                    <i className="bi bi-chat-left-dots-fill text-warning"></i>
                </div>
                <div>
                    <i className="bi bi-bookmark"></i>
                </div>
                <div>
                    <Link href={`/${slug}`}><i className="bi bi bi-info-lg"></i></Link>
                </div>
            </div>
        </header>
    )
}