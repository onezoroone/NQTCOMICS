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
        let count = 0;
        if(value1 == "" || startChap == ""){
            (toast.current as any).show({severity:'warn', summary: 'Cảnh báo', detail:'Vui lòng điền đầy đủ thông tin.', life: 3000});
        }else{
            setLoading(true);
            const chapters = startChap.split("\n");
            await axiosClient.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/crawlTruyenVN/` + value1)
            .then((res) => {
                (toast.current as any).show({severity:'success', summary: 'Thành công', detail: res.data.message, life: 3000});
                chapters.map((chap) => {
                    axiosClient.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/comics/v1/crawlChapterTruyenVN/${res.data.comicId}/${chap}`, {timeout: 1000000})
                    .then((message) => {
                        (toast.current as any).show({severity:'success', summary: 'Thành công', detail: message.data.message, life: 3000});
                    }).catch((err) => {
                        (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:err.response.data.message, life: 3000});
                    }).finally(() => {
                        count++;
                        if(count == chapters.length){
                            setLoading(false);
                        }
                    });
                })
            })
            .catch((err) => {
                (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:err.response.data.message, life: 3000});
            })
        }
    }

    return (  
        <>
        <div className={styles.container}>
            <Toast ref={toast} />
            <h2 className="text-white font-bold text-xl">API</h2>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className="flex gap-3">
                <Dropdown value={selectedAPI} onChange={(e) => setSelectedAPI(e.value)} options={options} optionLabel="name" 
                placeholder="Chọn API" />
                    <input value={value} placeholder="Nhập Slug Truyện. Ví dụ: mashle-2nd-season" onChange={(e) => setValue(e.target.value)} className={`${styles.input} w-full`} type="text" />
                </div>
                <div className="mt-4">
                    <Button loading={loading} className={`text-white rounded-4 ${styles.button}`}  label="Gửi API" type="submit"></Button>
                </div>
            </form>
        </div>
        <div className={`${styles.container} mt-5`}>
            <h2 className="text-white text-xl font-bold">Crawl TruyenVN</h2>
            <form className={styles.form} onSubmit={handleCrawl}>
                <div className="xl:flex gap-3">
                    <div className="flex gap-2 w-full xl:w-4/12 mb-3">
                        <textarea value={startChap} onChange={(e) => setStartChap(e.target.value)} placeholder="Nhập các tập cần crawl" className={`focus:outline-none px-3 py-2 w-full`} style={{background:'#111827'}} rows={10}></textarea>
                    </div>
                    <div className="w-full xl:w-8/12 mb-3">
                        <input value={value1} placeholder="Nhập slug truyện" onChange={(e) => setValue1(e.target.value)} className={`${styles.input} w-full`} type="text" />
                    </div>
                </div>
                <div className="mt-4">
                    <Button loading={loading} className={`text-white rounded-4 ${styles.button}`} label="Gửi API" type="submit"></Button>
                </div>
            </form>
        </div>
        </>
    );
}