/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='relative'>
        <img className='absolute top-0 left-0 w-screen h-screen object-cover object-center' src="/notfound/404.png" alt="" />
        <img src="/notfound/dragon.png" className='absolute sm:hidden top-10' alt="" />
        <img src="/notfound/person.png" className='absolute sm:hidden' alt="" style={{top:'450px', right:'60px'}} />
        <div className='flex flex-col absolute w-screen h-screen text-center px-3'>
            <h1 className='text-9xl mt-40' style={{fontWeight:'1000'}}>404</h1>
            <h1 className='text-5xl font-bold'>Không Tìm Thấy Trang</h1>
            <div className='flex justify-center mt-5'>
                <Link className='flex items-center py-2 px-4 rounded-md hover:bg-cyan-600 bg-cyan-500' href="/">Quay lại trang chủ<i className="bi bi-arrow-right"></i></Link>
            </div>
        </div>
    </div>
  )
}