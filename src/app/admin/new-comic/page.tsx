import NewComic from "@/components/NewComic/NewComic";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Thêm Truyện Mới - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    openGraph:{
        title: `Thêm Truyện Mới - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    },
    robots: 'noindex, nofollow'
}

async function Page() {
    return (  
        <NewComic />
    );
}

export default Page;