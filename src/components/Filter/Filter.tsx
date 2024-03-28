/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "./filter.module.css";
import Link from "next/link";
import { Button } from "primereact/button";
import { Sidebar } from 'primereact/sidebar';
import { RadioButton } from "primereact/radiobutton";
import Image from "next/image";
function Filter({data}: {data: any}) {
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterData, setFilterData] = useState<any | null>(null);
    const [ingredient, setIngredient] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const itemperPage = 24;
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        if(data && data.length !== 0){
            setPage(Math.ceil(data.comics.length / itemperPage));
            let filteredData = data.comics;
            const nameParam = searchParams.get("name");
            if(nameParam){
                filteredData = filteredData.filter((comic: any) => comic.title.toLowerCase().includes(nameParam.toLowerCase()));
            }
            const categoryParam = searchParams.get("the-loai");
            if (categoryParam) {
                filteredData = filteredData.filter((comic: any) => comic.genres.some((genre: any) => genre.slug === categoryParam));
                setIngredient(categoryParam);
            }
            const typeParam = searchParams.get("trang-thai");
            if (typeParam) {
                filteredData = filteredData.filter((comic: any) => comic.status.toLowerCase() === typeParam);
                setSelectedType(typeParam);
            }
            const sortParam = searchParams.get("sort");
            if (sortParam) {
                if(sortParam === "new") {
                    filteredData = filteredData.sort((a: any, b: any) => b.created_at - a.created_at);
                } else if(sortParam === "update") {
                    filteredData = filteredData.sort((a: any, b: any) => b.updated_at - a.updated_at);
                } else if(sortParam === "views") {
                    filteredData = filteredData.sort((a: any, b: any) => b.views - a.views);
                }
                setSelectedSort(sortParam);
            }
            if(filteredData && filteredData.length != 0){
                setPage(Math.ceil(filteredData.length / itemperPage));
                setCurrentPage(1);
            }
            setFilterData(filteredData);
        }
    },[searchParams])
    const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
    );
    const handleGenreClick = (e: any, genre: string) => {
        setIngredient(e.value);
        router.push(pathname + '?' + createQueryString('the-loai', genre));
        setVisible(false);
    }
    const handleTypeClick = (type:string) => {
        setSelectedType(type);
        router.push(pathname + '?' + createQueryString('trang-thai', type));
        setVisible(false);
    }
    const handleSortClick = (sort: string) => {
        setSelectedSort(sort);
        router.push(pathname + '?' + createQueryString('sort', sort));
        setVisible(false);
    }
    const handleClear = () => {
        setFilterData(null);
        setIngredient(null);
        setSelectedType(null);
        setSelectedSort(null);
        setVisible(false);
        router.push("/tim-kiem-nang-cao");
    }
    const pages = Array.from({ length: page }, (_, index) => index + 1);
    return (  
        <main className="flex flex-col items-center py-5 dark:bg-main1 bg-light1">
            <div className={styles.container}>
                <div className={`${styles.breadcrumb} breadcrumb w-full`}>
                    <Link href="/">Trang chủ</Link>
                    <span className={`${styles.icon}`}></span>
                    <Link href="#">Danh sách truyện</Link>
                </div>
                <div onClick={() => setVisible(true)} className={styles.btnMobile}>
                    <i className="bi bi-filter-left"></i>Lọc danh sách
                </div>
                <div className="flex gap-5 mt-5">
                    <Sidebar visible={visible} onHide={() => setVisible(false)} className={styles.sidebar}>
                        <div>
                            <h3>Thể loại truyện</h3>
                            <div className={styles.listcategories}>
                                {data.genres.map((item: any) => (
                                <div className="d-flex" key={item.id}>
                                    <RadioButton name="category" onChange={(e) => handleGenreClick(e,item.slug)} checked={ingredient === item.slug} value={item.slug} />
                                    <label htmlFor="ingredient1" className="ml-2">{item.name}</label> 
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3>Loại Phim</h3>
                            <div className={styles.listtype}>
                                <div className={selectedType === "completed" ? styles.active : undefined} onClick={() => handleTypeClick("completed")}>
                                    Hoàn thành
                                </div>
                                <div className={selectedType === "ongoing" ? styles.active : undefined} onClick={() => handleTypeClick("ongoing")}>
                                    Đang tiến hành
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3>Sắp xếp theo</h3>
                            <div className={styles.listtype}>
                                <div onClick={() => handleSortClick("new")} className={selectedSort == "new" ? styles.active : undefined}>
                                    Mới nhất
                                </div>
                                <div onClick={() => handleSortClick("update")} className={selectedSort == "update" ? styles.active : undefined}>
                                    Cập nhật
                                </div>
                                <div onClick={() => handleSortClick("views")} className={selectedSort == "views" ? styles.active : undefined}>
                                    Lượt xem
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button severity="danger" className="py-2 px-4 bg-red-500" onClick={() => handleClear()} label="Clear"></Button>
                        </div>
                    </Sidebar>
                    <div className={styles.filter}>
                        <div>
                            <h3>Thể loại truyện</h3>
                            <div className={styles.listcategories}>
                                {data.genres.map((item:any) => (
                                <div className="d-flex" key={item.id}>
                                    <RadioButton name="category" onChange={(e) => handleGenreClick(e,item.slug)} checked={ingredient === item.slug} value={item.slug} />
                                    <label htmlFor="ingredient1" className="ml-2">{item.name}</label> 
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3>Loại Phim</h3>
                            <div className={styles.listtype}>
                                <div onClick={() => handleTypeClick("completed")} className={selectedType == "completed" ? styles.active : undefined}>
                                    Hoàn thành
                                </div>
                                <div onClick={() => handleTypeClick("ongoing")} className={selectedType == "ongoing" ? styles.active : undefined}>
                                    Đang tiến hành
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3>Sắp xếp theo</h3>
                            <div className={styles.listtype}>
                                <div onClick={() => handleSortClick("new")} className={selectedSort == "new" ? styles.active : undefined}>
                                    Mới nhất
                                </div>
                                <div onClick={() => handleSortClick("update")} className={selectedSort == "update" ? styles.active : undefined}>
                                    Cập nhật
                                </div>
                                <div onClick={() => handleSortClick("views")} className={selectedSort == "views" ? styles.active : undefined}>
                                    Lượt xem
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button severity="danger" className="py-2 px-4 bg-red-500" onClick={() => handleClear()} label="Clear"></Button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className={styles.result}>
                            {!filterData && data.comics.slice((currentPage - 1) * itemperPage, currentPage * itemperPage).map((item: any) => (
                                <div className={styles.itemContent} key={item.id}>
                                    <Link href={`/${item.slug}`} className="flex flex-col gap-2 overflow-hidden">
                                        <Image width={200} height={250} src={item.thumbnail} alt={item.title} title={item.title} />
                                        <div className={styles.content}>
                                            <h6>{item.title}</h6>
                                        </div>
                                        <i className="bi bi-play-circle"></i>
                                    </Link>
                                </div>
                            ))}
                            {(filterData && filterData.length !== 0) && filterData.slice((currentPage - 1) * itemperPage, currentPage * itemperPage).map((item: any) => (
                                <div className={styles.itemContent} key={item.id}>
                                    <Link href={`/${item.slug}`} className="d-flex flex-column gap-2">
                                        <Image width={200} height={250} src={item.thumbnail} alt={item.title} title={item.title} />
                                        <div className={styles.content}>
                                            <h6>{item.title}</h6>
                                        </div>
                                        <i className="bi bi-play-circle"></i>
                                    </Link>
                                </div>
                            ))} 
                        </div>
                        {!filterData || filterData.length == 0 && 
                        <div className="text-black dark:text-white w-100 text-center">
                            <h4>Không có kết quả phù hợp.</h4>  
                        </div>}
                        <div className={styles.pagination}>
                            {currentPage != 1 && 
                            <div onClick={() => setCurrentPage(currentPage - 1)} className={styles.prevPage}>
                                <i className="bi bi-arrow-left"></i> Trang trước 
                            </div>}
                            <div className="d-flex gap-2">
                            {pages.map((page, index) => (
                                <div onClick={()=> setCurrentPage(index+1)} key={index} className={`${styles.page} ${currentPage == index + 1 && styles.active}`}>
                                    {page}
                                </div>
                            ))}
                            </div>
                            {currentPage != pages.length && 
                            <div onClick={() => setCurrentPage(currentPage + 1)} className={styles.nextPage}>
                                Trang tiếp <i className="bi bi-arrow-right"></i>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Filter;