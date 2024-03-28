"use client"
import styles from "./api.module.css";
import { useRef, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import axiosClient from "@/libs/axiosClient";
export default function ApiComic() {
    const router = useRouter();
    const toast = useRef(null);
    const [selectedAPI, setSelectedAPI] = useState(null);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [value1, setValue1] = useState("");
    const [startChap, setStartChap] = useState("");
    const [endChap, setEndChap] = useState("");
    const options = [
        {
            name: 'NCOMICS'
        },
        {
            name: 'OTRUYEN'
        },
    ];
    const onSubmit = async (ev: any) => {
        ev.preventDefault();
        if(!selectedAPI || value == ""){
            (toast.current as any).show({severity:'warn', summary: 'Cảnh báo', detail:'Vui lòng điền đầy đủ thông tin.', life: 3000});
        }else{
            setLoading(true);
            if((selectedAPI as { name: string }).name == "NCOMICS"){
                await fetch(`${process.env.NEXT_PUBLIC_BASE_API_NCOMICS}/comics/` + value)
                .then(res => res.json())
                .then(data => {
                    if(data.status && data.status === 500) {
                        (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ.', life: 3000});
                    }
                    else{
                    sessionStorage.setItem('apimovie', JSON.stringify(data));
                    router.push("/admin/new-comic?comic="+data.id+"&api=" + (selectedAPI as { name: string }).name);
                    }
                })
                .catch(() => {
                    (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ.', life: 3000});
                })
            }else if((selectedAPI as { name: string }).name == "OTRUYEN"){
                await fetch(`${process.env.NEXT_PUBLIC_BASE_API_OTRUYEN}/truyen-tranh/` + value)
                .then(res => res.json())
                .then(data => {
                    if(data.status && data.status === 500) {
                        (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ.', life: 3000});
                    }
                    else{
                    sessionStorage.setItem('apimovie', JSON.stringify(data));
                    router.push("/admin/new-comic?comic="+data.data.params.slug+"&api=" + (selectedAPI as { name: string }).name);
                    }
                })
                .catch(() => {
                    (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ.', life: 3000});
                })
            }
            setLoading(false);
        }
    }

    const handleCrawl = async (ev: any) => {
        ev.preventDefault();
        if(value1 == "" || startChap == "" || endChap == ""){
            (toast.current as any).show({severity:'warn', summary: 'Cảnh báo', detail:'Vui lòng điền đầy đủ thông tin.', life: 3000});
        }else{
            setLoading(true);
            await axiosClient.post(`/api/comics/crawlTruyenVN/` + value1, {startChap, endChap}, { timeout: 500000 })
            .then(() => {
                (toast.current as any).show({severity:'success', summary: 'Thành công', detail:'Crawl thành công.', life: 3000});
            })
            .catch(() => {
                (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ hoặc quá thời gian chờ.', life: 3000});
            })
            setLoading(false);
        }
    }

    return (  
        <>
        <div className={styles.container}>
            <Toast ref={toast} />
            <h2 className="text-white">API</h2>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className="flex gap-3">
                <Dropdown value={selectedAPI} onChange={(e) => setSelectedAPI(e.value)} options={options} optionLabel="name" 
                placeholder="Chọn API" />
                    <input value={value} placeholder="Nhập Slug Truyện. Ví dụ: mashle-2nd-season" onChange={(e) => setValue(e.target.value)} className={styles.input} type="text" />
                </div>
                <div className="mt-4">
                    <Button loading={loading} className={`text-white rounded-4 ${styles.button}`}  label="Gửi API" type="submit"></Button>
                </div>
            </form>
        </div>
        <div className={`${styles.container} mt-5`}>
            <h2 className="text-white">Crawl TruyenVN</h2>
            <form className={styles.form} onSubmit={handleCrawl}>
                <div className="flex gap-3">
                    <input type="text" className={`${styles.input} w-48`} value={startChap} onChange={(e) => setStartChap(e.target.value)} placeholder="Chap đầu" />
                    <input type="text" className={`${styles.input} w-48`} value={endChap} onChange={(e) => setEndChap(e.target.value)} placeholder="Chap cuối" />
                    <input value={value1} placeholder="Nhập slug truyện" onChange={(e) => setValue1(e.target.value)} className={`${styles.input} w-full`} type="text" />
                </div>
                <div className="mt-4">
                    <Button loading={loading} className={`text-white rounded-4 ${styles.button}`} label="Gửi API" type="submit"></Button>
                </div>
            </form>
        </div>
        </>
    );
}