"use client"
import styles from "./api.module.css";
import { useRef, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { token } from "@/libs/data";
export default function ApiComic() {
    const router = useRouter();
    const toast = useRef(null);
    const [selectedAPI, setSelectedAPI] = useState(null);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedAPI1, setSelectedAPI1] = useState(null);
    const [value1, setValue1] = useState("");
    const options = [
        {
            name: 'NCOMICS'
        },
        {
            name: 'OTRUYEN'
        },
        {
            name: 'SAYHEN'
        }
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
            }else if((selectedAPI as { name: string }).name == "SAYHEN"){
                const header = new Headers();
                header.append('Content-Type', 'application/json');
                header.append('Authorization', 'Bearer ' + token);
                await fetch(`/api/comics/crawlSayhentai/` + value,
                {
                    method: 'POST',
                    headers: header
                })
                .then(res => res.json())
                .then(data => {
                    if(data.status && data.status === 500) {
                        (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ.', life: 3000});
                    }
                    else{
                        (toast.current as any).show({severity:'success', summary: 'Thành công', detail:'Crawl thành công.', life: 3000});
                    }
                })
                .catch(() => {
                    (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Đường dẫn không hợp lệ.', life: 3000});
                })
            }
            setLoading(false);
        }
    }

    const hanldeUpdate = async (e: any) => {
        e.preventDefault();
        // if(!selectedAPI1 || value1 == ""){
        //     toast.current.show({severity:'warn', summary: 'Cảnh báo', detail:'Vui lòng điền đầy đủ thông tin.', life: 3000});
        // }else{
        //     setLoading(true);
        //     if(selectedAPI1.name == "NCOMICS"){
        //         const response = await axios.get(`${import.meta.env.VITE_BASE_NCOMICS_URL}/comics/phim-moi-cap-nhat?page=` + value1)
        //         for(let i = 0; i < response.data.items.length; i++){
        //             await axiosClient.post("/movies/leechMovies",{
        //                 data: response.data.items[i],
        //                 serverName: "NGUONC",
        //                 name: response.data.items[i].name
        //             }).then((res) => {
        //                 toast.current.show({severity:'success', summary: 'Thành công', detail:res.data, life: 3000});
        //             }).catch((err) => {
        //                 toast.current.show({severity:'error', summary: 'Lỗi', detail:err.response.data.message, life: 3000});
        //             })
        //         }
        //     }else if(selectedAPI1.name == "OPHIM"){
        //         const response = await axios.get(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=` + value1)
        //         for(let i = 0; i < response.data.items.length; i++){
        //             await axiosClient.post("/movies/leechMovies",{
        //                 data: response.data.items[i],
        //                 serverName: "OPHIM",
        //                 name: response.data.items[i].name
        //             }).then((res) => {
        //                 toast.current.show({severity:'success', summary: 'Thành công', detail:res.data, life: 3000});
        //             }).catch((err) => {
        //                 toast.current.show({severity:'error', summary: 'Lỗi', detail:err.response.data.message, life: 3000});
        //             })
        //         }
        //     }
        //     setLoading(false);
        // }
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
                    <input value={value} placeholder="Nhập Slug Phim. Ví dụ: mashle-2nd-season" onChange={(e) => setValue(e.target.value)} className={styles.input} type="text" />
                </div>
                <div className="mt-4">
                    <Button loading={loading} className={`text-white rounded-4 ${styles.button}`}  label="Gửi API" type="submit"></Button>
                </div>
            </form>
        </div>
        <div className={`${styles.container} mt-5`}>
            <h2 className="text-white">Crawl nhanh</h2>
            <form className={styles.form} onSubmit={hanldeUpdate}>
                <div className="flex gap-3">
                <Dropdown value={selectedAPI1} onChange={(e) => setSelectedAPI1(e.value)} options={options} optionLabel="name" 
                placeholder="Chọn API" />
                    <input value={value1} placeholder="Nhập số trang. Ví dụ: 1" onChange={(e) => setValue1(e.target.value)} className={styles.input} type="text" />
                </div>
                <div className="mt-4">
                    <Button loading={loading} className={`text-white rounded-4 ${styles.button}`} label="Gửi API" type="submit"></Button>
                </div>
            </form>
        </div>
        </>
    );
}