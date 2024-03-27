"use client"
import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import Link from 'next/link';
import { token } from '@/libs/data';
import Image from 'next/image';

export default function ListComics() {
    const [deleteComicDialog, setDeleteComicDialog] = useState(false);
    const [deleteComicsDialog, setDeleteComicsDialog] = useState(false);
    const [comic, setComic] = useState({});
    const [selectedComics, setSelectedComics] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        fetch("/api/comics/getAllComics",{
            headers: headers,
        })
        .then(res => res.json())
        .then(data => {
            setData(data);
        })
        .catch(() => {
            console.log("error");
        })
        
        }, [reload])
    const hideDeleteComicDialog = () => {
        setDeleteComicDialog(false);
        setDeleteComicsDialog(false);
    };

    const confirmDeleteComic = (comic: any) => {
        setComic(comic);
        setDeleteComicDialog(true);
    };

    const deleteComic = async () => {
        setLoading(true);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        fetch("/api/comics/deleteComic",{
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                id: (comic as { id: number }).id,
                title: (comic as {title: string}).title
            })
        })
        .then(res => res.json())
        .then(data => {
            (toast.current as any).show({severity:'success', summary: 'Thành công', detail:data, life: 5000});
        })
        .catch(() => {
            (toast.current as any).show({severity:'error', summary: 'Thất bại', detail:'Xảy ra lỗi, vui lòng thử lại sau', life: 5000});
        })
        // await axiosClient.post("/Comics/deleteComic",{
        //     id: Comic.id,
        //     name: Comic.name
        // }).then((response => {
        //     toast.current.show({severity:'success', summary: 'Thành công', detail:response.data, life: 5000});
        // }))
        setReload(!reload);
        setLoading(false);
        setDeleteComicDialog(false);
    };

    const exportCSV = () => {
        (dt.current as any).exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteComicsDialog(true);
    };

    const deleteSelectedComics = async () => {
        setLoading(true);
        if (selectedComics) {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer ' + token);
            const selectedComicsArray = selectedComics as any[];
            for(var i=0; i < (selectedComics as any).length; i++){
                fetch("/api/comics/deleteComic",{
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        id: selectedComicsArray[i].id,
                        title: selectedComicsArray[i].title
                    })
                })
                .then(res => res.json())
                .then(data => {
                    (toast.current as any).show({severity:'success', summary: 'Thành công', detail:data, life: 5000});
                })
                .catch(() => {
                    (toast.current as any).show({severity:'error', summary: 'Thất bại', detail:'Xảy ra lỗi, vui lòng thử lại sau', life: 5000});
                })
            }
        }
        setReload(!reload);
        setLoading(false);
        setDeleteComicsDialog(false);
        setSelectedComics(null);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Link href="/admin/new-comic"><Button label="Thêm mới" icon="bi bi-plus" className='text-white rounded-3 py-2 px-4 bg-green-500 hover:bg-green-600' style={{marginRight:'10px'}} severity="success" /></Link>
                <Button label="Xóa" className='text-white rounded-3 bg-red-600 px-4 py-2 hover:bg-red-700' icon="bi bi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedComics || !(selectedComics as string).length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Xuất file csv" icon="bi bi-upload" className="bg-purple-600 px-4 py-2 hover:bg-purple-700 text-white" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData: any) => {
        return <Image src={rowData.thumbnail} alt={rowData.title} style={{borderRadius:'10px'}} width={200} height={100} />;
    };

    const ratingBodyTemplate = (rowData: any) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const TypeBodyTemplate = (rowData: any) => {
        return <Tag className='text-center' value={rowData.chapter}></Tag>
    };

    const categoryTemplate = (rowData: any) => {
        return <span>{rowData.genres.map((item: any,index: number) => <span key={index}>
        {item.name}
        {index < rowData.genres.length - 1 && ", "}
    </span>)}</span>
    }

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Link href={`/admin/edit-comic/${rowData.slug}`}><Button icon="bi bi-pencil" rounded outlined className="mr-2 rounded-5 bg-green-500 hover:bg-green-600" style={{marginRight:'10px'}} /></Link>
                <Button icon="bi bi-trash" rounded outlined severity="danger" className='rounded-5 bg-red-500 hover:bg-red-600' onClick={() => confirmDeleteComic(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 items-center justify-between">
            <h4 className="m-0 text-2xl">Quản lý phim</h4>
            <span className="p-input-icon-left">
                <i className="bi bi-search fs-5" style={{marginTop:'-0.7rem'}} />
                <InputText type="search" className='p-3 pl-10' onInput={(e) => setGlobalFilter((e.target as any).value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );
    const deleteComicDialogFooter = (
        <React.Fragment>
            <Button label="Không" icon="bi bi-x" className='rounded-3 bg-slate-500 py-2 px-4 hover:bg-slate-600' style={{marginRight:'10px'}} outlined onClick={hideDeleteComicDialog} />
            <Button label="Có" loading={loading} icon="bi bi-check" severity="danger" className='rounded-3 py-2 px-4 hover:bg-red-600 bg-red-500' onClick={deleteComic} />
        </React.Fragment>
    );
    const deleteComicsDialogFooter = (
        <React.Fragment>
            <Button label="Không" icon="bi bi-x" className='rounded-3' style={{marginRight:'10px'}} outlined onClick={hideDeleteComicDialog} />
            <Button label="Có" loading={loading} icon="bi bi-check" className='rounded-3' severity="danger" onClick={deleteSelectedComics} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={data} selection={selectedComics} onSelectionChange={(e) => setSelectedComics(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Đang hiển thị {first} đến {last} của {totalRecords} truyện" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="Code" sortable></Column>
                    <Column field="title" header="Tên" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="origin_name" header="Tên khác"></Column>
                    <Column field="thumbnail" header="Ảnh" body={imageBodyTemplate}></Column>
                    <Column field="genres" header="Thể loại" body={categoryTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="rating" header="Đánh giá" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="chapter" header="Chương" body={TypeBodyTemplate} style={{ minWidth: '6rem' }} sortable ></Column>
                    <Column field="created_at" header="Ngày đăng" sortable ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={deleteComicDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteComicDialogFooter} onHide={hideDeleteComicDialog}>
                <div className="confirmation-content pt-5">
                    <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', marginRight:'15px' }} />
                    {comic && (
                        <span>
                            Bạn có chắc chắn muốn xóa <b>{(comic as { title: string }).title}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteComicsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Xác nhận" modal footer={deleteComicsDialogFooter} onHide={hideDeleteComicDialog}>
                <div className="confirmation-content">
                    <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', marginRight:'15px' }} />
                    {comic && <span>Bạn có chắc chắn muốn xóa các bộ truyện đã chọn?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        