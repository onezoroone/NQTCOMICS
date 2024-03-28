"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./layoutadmin.module.css";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
function LayoutAdmin({ children } : { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeSidebar, setActiveSidebar] = useState(false);
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState(0);
    const [dropdown, setDropdown] = useState(false);
    useEffect(() => {
        const check = async () => {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
            await fetch("/api/checkAdmin", {
                headers: headers,
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === "error") {
                    router.push('/');
                }else{
                    setLoading(false);
                }
            })
            .catch(() => router.push('/'));
        }
        check();
    }, [router])
    type SidebarItem = {
        name: string;
        link: string;
        icon: string;
    };
    const sidebar: SidebarItem[] = [
        {
            name: 'Trang điều khiển',
            link: 'dashboard',
            icon: "bi-house-gear-fill"
        },
        {
            name: 'Người dùng',
            link: '/admin/list-users',
            icon: "bi-person-fill-gear"
        },
        {
            name: 'Api',
            link: '/admin/api',
            icon: 'bi-rocket-takeoff-fill'
        },
        {
            name: 'Danh sách truyện',
            link: '/admin/list-comics',
            icon: 'bi-book',
        },
        {
            name: 'Thêm mới',
            link: '/admin/new-comic',
            icon: 'bi-folder-plus'
        },
        {
            name: 'Bình luận',
            link: '/admin/reviews',
            icon: 'bi-chat-dots-fill'
        },
        {
            name: 'Thể loại',
            link: '/admin/categories',
            icon: 'bi-tags-fill'
        },
        {
            name: 'Báo cáo truyện',
            link: '/admin/list-reports',
            icon: 'bi-flag-fill'
        }
    ]
    const handleToggle = () => {
        setActiveSidebar(!activeSidebar);
    }
    return (  
        <div className="admin-layout" style={{background:'var(--bg-main)'}}>
            {loading ? <div className="h-screen w-screen flex justify-center items-center"><div className={styles.loader}></div></div> : (
            <div className={`${activeSidebar && styles.activeSidebar}`}>
                <nav className={`${styles.sidebar}`}>
                    <div className={styles.containerlogo}>
                        <Link className={`flex items-center gap-2 ${styles.logoimg}`} href="/admin/dashboard"><Image width={50} height={50} src="/logo1.png" alt="Comic" /><h3 className={styles.titleLogo}>NQT Comic</h3></Link>
                    
                        <div className="flex-1 flex justify-end text-3xl" style={{paddingRight:'15px'}}>
                            <i style={{cursor:'pointer'}} onClick={() => handleToggle()} className="bi bi-list fs-3"></i>
                        </div>
                    </div>
                    <div className={styles.customer}>
                        <i onClick={() => handleToggle()} className={`bi bi-list text-4xl ${styles.mobileToggle}`}></i>  
                        <div>
                            <i className="bi text-4xl bi-person-circle"></i>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className={styles.welcome}>
                                Chào mừng <span className="text-danger">Nghiêm Quang Thắng</span>
                            </div>
                            <div className="text-secondary text-center">
                                Admin
                            </div>
                        </div>
                    </div>
                    <ul className={`${styles.listsidebar}`} style={{overflow: 'auto'}}>
                        {sidebar.map((item,index) => (
                            <li onClick={() => setActive(index)} className={`${styles.navLink} ${index == active && styles.active}`} key={index}>
                                <Link href={item.link}>
                                    <i className={`${styles.icon} bi ${item.icon}`}></i>
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Sidebar className="admin" visible={visible} onHide={() => setVisible(false)}>
                <div className={styles.containerlogo}>
                        <Image src="/logo1.png" width={70} height={50} alt="Comic" />
                        <h3 className={styles.titleLogo}>NQT Comics</h3>
                    </div>
                    <div className={styles.customer}>
                        <div>
                            <i className="bi text-4xl bi-person-circle"></i>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className={styles.welcome}>
                                Welcome <span className="text-danger">Nghiêm Quang Thắng</span>
                            </div>
                            <div className="text-secondary text-center">
                                Admin
                            </div>
                        </div>
                    </div>
                    <ul className={`${styles.listsidebar}`}>
                        {sidebar.map((item,index) => (
                            <li onClick={() => setActive(index)} className={`${index == active && styles.active}`} key={index}>
                                <Link href={item.link}>
                                    <i className={`${styles.icon} bi ${item.icon}`}></i>
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Sidebar>
                <header className={styles.header}>
                    <div className="flex flex-1 justify-end items-center gap-2">
                        <div className="flex gap-3 items-center" style={{marginRight:'20px'}}>
                            <i className="bi text-2xl bi-bell"></i>
                            <i className="bi text-2xl bi-gear-fill"></i>
                        </div>
                        <div className={`${styles.infoCustomer} relative inline-block text-left`}>
                            <button onClick={() => setDropdown(!dropdown)} type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md text-white px-3 py-2 text-xl font-semiboldshadow-sm">
                                <i className="bi bi-person-circle fs-3"></i> 
                                <span>Admin</span>
                                <i className="bi fs-6 bi-chevron-down"></i>
                            </button>
                            <div className={`absolute ${!dropdown ? 'hidden' : undefined} right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${styles.menuperson}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                <div className="py-1" role="none">
                                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-0"><i className="bi bi-box-arrow-right"></i>Đăng xuất</a>
                                    <Link href="/" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex={-1} id="menu-item-1">TRANG CHỦ</Link>
                                </div>
                            </div>
                        </div>
                        <i onClick={() => setVisible(true)} className={`bi bi-filter-right ${styles.toogleMobildHeader}`}></i>
                    </div>
                </header>
                <main className={styles.maincontent}>
                    {children}
                </main>
                <footer className={styles.footer}>
                    <div className="w-full flex justify-end">
                        Copyright © 2024 <b className="text-white"> NQT Comic </b> All Rights Reserved.
                    </div>
                </footer>
            </div>
            )}
            <NextTopLoader
                color="#e4863e"
                initialPosition={0.08}
                crawlSpeed={200}
                height={5}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow="0 10px 20px rgba(232, 134, 62, 0.19), 0 6px 6px rgba(72, 99, 62, 0.23)"
                zIndex={1600}
            />
            <NextTopLoader />
        </div>
    );
}

export default LayoutAdmin;