import HeaderGuest from "@/components/Header/Header";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import "primereact/resources/themes/md-dark-indigo/theme.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSpecialPage = false;

  if (isSpecialPage) {
    return <>{children}</>;
  }

  return (
    <>
      <NextTopLoader
        color="#e4863e"
        initialPosition={0.08}
        crawlSpeed={200}
        height={5}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 10px 20px rgba(232, 134, 62, 0.19), 0 6px 6px rgba(72, 99, 62, 0.23)"
        zIndex={1600}
      />
      <HeaderGuest />
      {children}
      <footer style={{ background: 'var(--background-main-1)', paddingTop: '100px' }}>
        <div className="container">
          <div className="flex justify-center flex-col items-center text-slate-400 gap-3">
            <Image width={200} height={100} src="/logo.png" alt="logo" />
            <div className="text-center">
              Website đọc truyện tranh online với nhiều thể loại truyện hấp dẫn như Manhwa (Hàn Quốc), Manhua (Trung Quốc), Manga (Nhật Bản), truyện ngôn tình, truyện cổ đại, truyện xuyên không luôn được cập nhật chapter mới nhanh và hình ảnh chất lượng cao. Trải nghiệm thế giới truyện tranh hoàn toàn miễn phí. Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet, chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.
            </div>
            <div>
              Copyright © 2024 NQTCOMICS - All rights reserved.
            </div>
            <div className="mb-5">
              Email: testmailphpnqt@gmail.com
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
