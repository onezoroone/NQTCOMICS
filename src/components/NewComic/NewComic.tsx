"use client"
import { useEffect, useRef, useState } from "react";
import styles from "./newcomics.module.css"
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { InputText } from 'primereact/inputtext';
import { Editor } from "primereact/editor";
import { MultiSelect } from 'primereact/multiselect';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
function NewComic() {
    const [name, setName] = useState("");
    const [othername, setOthername] = useState("");
    const [chapter, setChapter] = useState("");
    const [slug, setSlug] = useState("");
    const [status, setStatus] = useState("");
    const [image, setImage] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState(null);
    const [nameServer, setNameServer] = useState("");
    const searchParams = useSearchParams();
    const toast = useRef(null);
    const router = useRouter();
    const [categories, setCategories] = useState([
       {
        name: "check",
        id: '123'
       }
    ]);
    useEffect(() => {
        const source = searchParams.get('api');
        if(source){
            if(source == "NCOMICS"){
                const data = JSON.parse(sessionStorage.getItem('apimovie') || '');
                if(!data){
                    notFound();
                }
                const comic = data;
                setName(comic.title);
                setSlug(comic.id)
                setOthername(comic.other_names[0]);
                setChapter(comic.chapters[0].name);
                setAuthor(comic.authors);
                setDescription(comic.description);
                setStatus(comic.status);
                setImage(comic.thumbnail);
                const category = comic.genres.map(function(item: any) {
                    return {"name" : item.name};
                });
                setSelectedCategories(category);
                setChapters(comic.chapters);
                setNameServer("NCOMICS");
            }else if(source == "OTRUYEN"){
                const data = JSON.parse(sessionStorage.getItem('apimovie') || "");
                if(!data){
                    notFound();
                }
                const comic = data.data.item;
                setName(comic.name);
                setOthername(comic.origin_name[0]);
                setChapter(comic.chapters[0].server_data[comic.chapters[0].server_data.length - 1].chapter_name);
                setDescription(comic.content);
                setStatus(comic.status);
                setImage(data.data.seoOnPage.seoSchema.image);
                const category = comic.category.map(function(item: any) {
                    return {"name" : item.name};
                });
                setSelectedCategories(category);
                setChapters(comic.chapters[0].server_data);
                setAuthor(comic.author[0]);
                setNameServer("OTRUYEN");
            }
        }
        // axiosClient.get("/categories/getAllCategories")
        // .then((res) => {
        //     setCategories(res.data);
        // })
    },[searchParams])
    const onSubmit = async (ev: any) => {
        ev.preventDefault();
        if (name == "" || !selectedCategories) {
            (toast.current as any).show({severity:'warn', summary: 'Cảnh Báo', detail:'Không được để trống tên và thể loại phim.', life: 3000});
        } else {
            setLoading(true);
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('token') || '');
            await fetch("/api/comics/v1/crawlComic",{
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name, othername, slug, chapter, status, image, author, description, selectedCategories, chapters, nameServer
                })
            })
           .then(res => res.json())
              .then(data => {
                if(data.status === "error") {
                    (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:data.message, life: 3000});
                }else{
                    (toast.current as any).show({severity:'success', summary: 'Thành công', detail:data.message, life: 3000});
                    router.push('/admin/list-comics');
                }
            })
            .catch(() => {
                (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:'Truyện đã tồn tại hoặc quá thời gian chờ.', life: 3000});
            })
            setLoading(false);
        }
    }
    return (  
        <div className={styles.container}>
            <Toast ref={toast} />
            <div className={styles.titleContainer}>
                <h2>Thêm Phim Mới</h2>
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
                        <div className="mt-5 text-end">
                            <Button icon="bi bi-check" loading={loading} className="text-white bg-teal-300 p-4 hover:bg-teal-400" label="Thêm Phim" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewComic;