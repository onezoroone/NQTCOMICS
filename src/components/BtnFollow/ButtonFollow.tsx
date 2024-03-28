"use client"
import axiosClient from '@/libs/axiosClient';
import React, { useState } from 'react';

const ButtonFollow = ({check, id}: {check: boolean, id: number}) => {
    const [isFollowing, setIsFollowing] = useState(check);
    const handleClick = async () => {
        if(localStorage.getItem('token') === null) {
            alert('Vui lòng đăng nhập để thực hiện chức năng này!');
        }
        else{
            setIsFollowing(!isFollowing);
            await axiosClient.post('/api/comics/v1/followComic', {comic_id: id})
            .then((res) => {
                alert(res.data.message);
            });
        }
    };
    return (
        <button type="button" onClick={handleClick} className={`${isFollowing? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} px-4 rounded`}><i className="bi bi-bookmark-fill mr-1"></i>{isFollowing? 'Bỏ Theo Dõi' : 'Theo Dõi'}</button>
    );
};

export default ButtonFollow;