import ListComics from "@/components/ListComics/ListComics";
export const metadata = {
    title: `Danh Sách Truyện - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    openGraph:{
        title: `Danh Sách Truyện - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    },
    robots: 'noindex, nofollow'
}

async function Page() {
    return (  
        <ListComics />
    );
}

export default Page;