import ApiComic from "@/components/Api/ApiComic";

export const metadata = {
    title: `API Comic - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    openGraph:{
        title: `API Comic - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    },
    robots: 'noindex, nofollow'
}

export default async function Page() {
    return (  
        <ApiComic />
    );
}