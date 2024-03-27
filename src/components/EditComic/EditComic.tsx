"use client"
import { useRef, useState } from "react";
import styles from "../NewComic/newcomics.module.css"
import { InputText } from 'primereact/inputtext';
import { Editor } from "primereact/editor";
import { MultiSelect } from 'primereact/multiselect';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Link from "next/link";
export default function EditComic({data, genres}: {data: any, genres: any}) {
    const comic = data.comic;
    const [name, setName] = useState(comic.title);
    const [othername, setOthername] = useState(comic.origin_name);
    const [chapter, setChapter] = useState(comic.chapter);
    const [status, setStatus] = useState(comic.status);
    const [image, setImage] = useState(comic.thumbnail);
    const [author, setAuthor] = useState(comic.authors);
    const [description, setDescription] = useState(comic.description);
    const [selectedCategories, setSelectedCategories] = useState(data.genres);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [categories,] = useState(genres);
    const onSubmit = async (ev: any) => {
        ev.preventDefault();
        if (name == "" || !selectedCategories) {
            (toast.current as any).show({severity:'warn', summary: 'Cảnh Báo', detail:'Không được để trống tên và thể loại phim.', life: 3000});
        } else {
            setLoading(true);
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
            await fetch("/api/comics/updateComic",{
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    id: comic.id, name, othername, chapter, status, image, author, description, selectedCategories
                })
            })
           .then(res => res.json())
              .then(data => {
                if(data.status === "error") {
                    (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:data.message, life: 3000});
                }else{
                    (toast.current as any).show({severity:'success', summary: 'Thành công', detail:data.message, life: 3000});
                }
            })
            .catch((err) => {
                (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Tên truyện đã tồn tại.', life: 3000});
            })
            setLoading(false);
        }
    }
    return (  
        <div className={styles.container}>
            <Toast ref={toast} />
            <div className={styles.titleContainer}>
                <h2 className="text-2xl">Sửa Phim {comic.title}</h2>
            </div>
            <div className={styles.background}>
                <form className="2xl:flex" onSubmit={onSubmit}>
                    <div className="2xl:w-9/12 w-full flex flex-col gap-3 2xl:pr-10 mb-5">
                        <InputText value={name} className={styles.input} placeholder="Tên Truyện" onChange={(e) => setName(e.target.value)} />
                        <InputText value={othername} className={styles.input} placeholder="Tên Khác" onChange={(e) => setOthername(e.target.value)} />
                        {description != "" && <Editor value={description} onTextChange={(e) => setDescription(e.htmlValue || '')} style={{ height: '300px' }} />}
                        {description == "" && <Editor value={description} onTextChange={(e) => setDescription(e.htmlValue || '')} style={{ height: '300px' }} />}
                        <MultiSelect value={selectedCategories} onChange={(e) => setSelectedCategories(e.value)} options={categories} optionLabel="name" display="chip" 
                            placeholder="Thể Loại truyện" className="border-slate-600 border-2" />
                        <div className={styles.row1}>
                            <InputText value={status} className={styles.input} placeholder="Trạng Thái" onChange={(e) => setStatus(e.target.value)} />
                            <InputText value={chapter} className={styles.input} placeholder="Chương" onChange={(e) => setChapter(e.target.value)} />
                        </div>
                        <div className={styles.row2}>
                            <InputText value={author} className={styles.input} placeholder="Tác giả" onChange={(e) => setAuthor(e.target.value)} />
                            <InputText value={author} className={styles.input} placeholder="Nhóm dịch" onChange={(e) => setAuthor(e.target.value)} />
                        </div>
                    </div>
                    <div className="2xl:w-3/12 w-full flex flex-col">
                        <div className="flex justify-center">
                            <div className={styles.imageBackground} style={{backgroundImage: `url(${image})`}}></div>
                        </div>
                        <div className="mt-3">
                            <InputText className={`${styles.input} w-full`} value={image} placeholder="Url Ảnh" onChange={(e) => setImage(e.target.value)} />
                        </div>
                        <div className="mt-5 text-end flex gap-2 justify-end">
                            <Link href={`/admin/list-chapters/${comic.slug}`} className="p-4 bg-teal-400 hover:bg-teal-500 text-white rounded"><i className="bi bi-database mr-2"></i>Chương</Link>
                            <Button icon="bi bi-check" loading={loading} className="text-white bg-green-500 p-4 hover:bg-green-400" label="Sửa Phim" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}