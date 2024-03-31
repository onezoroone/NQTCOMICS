"use client"
import { useEffect, useRef, useState } from "react";
import styles from "./newcomics.module.css"
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { InputText } from 'primereact/inputtext';
import { Editor } from "primereact/editor";
import { MultiSelect } from 'primereact/multiselect';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axiosClient from "@/libs/axiosClient";

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
    const [chapters, setChapters] = useState<any>(null);
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
            let count = 0;
            let allChapters: any[] = [];
            let result: any[] = [];
            let idComic: any = null;
            let promises: any[] = [];
            await axiosClient.post("/api/comics/v1/crawlComic",{
               name, othername, slug, chapter, status, image, author, description, selectedCategories, chapters, nameServer
            })
            // await axiosClient.post(process.env.NEXT_PUBLIC_BASE_API_URL +  "/api/comics/v1/crawlComic",{
            //     params: {
            //         name, othername, slug, chapter, status, image, author, description, selectedCategories, nameServer
            //     }
            // })
            .then((response) => {
                idComic = response.data.comicId;
                (toast.current as any).show({severity:'success', summary: 'Thành công', detail: response.data.message, life: 3000});
                if(nameServer == "OTRUYEN"){
                    promises = chapters.map((dataChapter: any) => {
                        return axiosClient.get(dataChapter.chapter_api_data)
                          .then((res) => {
                            allChapters.push(res.data.data);
                          });
                    });
                }else if(nameServer == "NCOMICS"){
                    promises = chapters.map((dataChapter: any) => {
                        return axiosClient.get('https://comics-api.vercel.app/comics/' + slug + '/chapters/' + dataChapter.id)
                          .then((res) => {
                            const test = {
                                chapter: res.data.chapter_name,
                                images: res.data.images
                            }
                            allChapters.push(test);
                          });
                    });
                } 
            })
            .catch((err) => {
                (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:err.response.data.message, life: 3000});
            })
            await Promise.all(promises)
            .then(async () => {
                for (let i = 0; i < allChapters.length; i += 5) {
                    const chunk = allChapters.slice(i, i + 5);
                    result.push(chunk);
                }
                if(result.length !== 0){
                    const postPromises = result.map((item: any, index) => {
                    return axiosClient.post("/api/comics/v1/crawlChapter",{
                        idComic,
                        chapters: item,
                        nameServer,
                        turn: index + 1
                    }).then((res) => {
                        (toast.current as any).show({severity:'success', summary: 'Thành công', detail:res.data.message, life: 3000});
                    }).catch((err) => {
                          (toast.current as any).show({severity:'error', summary: 'Lỗi', detail:err.response.data.message, life: 3000});
                    })
                    .finally(() => {
                        count++;
                        if(count == result.length){
                            setLoading(false);
                            alert("Thêm phim thành công");
                            router.push('/admin/list-comics');
                            // const inter = setInterval(() => {
                            //     router.push('/admin/list-comics');
                            // }, 5000);
                            // clearInterval(inter);
                        }
                        })
                    });
                    await Promise.all(postPromises);
                }
            })
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