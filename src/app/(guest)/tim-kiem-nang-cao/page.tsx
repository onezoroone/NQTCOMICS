import LayoutRoot from "@/app/(guest)/layoutGuest";
import Filter from "@/components/Filter/Filter";
import { getFilter } from "@/libs/api/comics";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: `Tìm Kiếm Nâng Cao - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    openGraph: {
        title: `Tìm Kiếm Nâng Cao - ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    },
    robots: 'noindex, nofollow',
}

async function FilterLayout() {
    const data = await getFilter();
    return (
        <LayoutRoot>
            <Filter data={data} />
        </LayoutRoot>
    );
}

export default FilterLayout;