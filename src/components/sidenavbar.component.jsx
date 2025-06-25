import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const SideNav = () => {

    const { userAuth, userAuth: { accessToken, user} } = useContext(UserContext);
    
    console.log(user)
    // Lấy role từ userAuth.user.role và so sánh với "ADMIN"
    const isAdmin = userAuth?.user?.role === "ADMIN";
    
    let page = location.pathname.split("/")[2];
    let [pageState, setPageState]=useState(page.replace("-", " "));

    let [showSidenav, setShowSidenav] = useState(false);
    let activeTabLine = useRef() ;
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e)=>{
        let{offsetLeft, offsetWidth} = e.target;
        activeTabLine.current.style.left = `${offsetLeft}px`;
        activeTabLine.current.style.width = `${offsetWidth}px`;

        if(e.target == sideBarIconTab.current){
            setShowSidenav(true);
        }
        else{
            setShowSidenav(false);
        }
    }

    useEffect(()=>{
        setShowSidenav(false);
        pageStateTab.current.click();
    }, [page]);

    return (
        accessToken === null ? <Navigate to="/signin" /> :
        <>
            <section className="relative flex gap-10 py-0 m-0 max-md:flex-col h-10">
                <div className="sticky top-[80%] z-30">

                    <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                        <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}>
                            <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                        </button>
                        <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                            {pageState}
                        </button>
                        <hr ref={activeTabLine} className="absolute bottom-0 duration-500"/>
                    </div>

                    <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute md:relative max-md:top-[64px] bg-white max=md:[calc(100%-80px)] max-md:px-16 max-md:ml-7 duration-500 " + (!showSidenav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>
                        <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />
                        <NavLink to="/dashboard/blogs" onClick={(e)=>setPageState(e.target.innerText)} className='sidebar-link'>
                            <i className="fi fi-rr-document"></i>
                            Blogs
                        </NavLink>

                        <NavLink to="/setting/usermanage" onClick={(e)=>setPageState(e.target.innerText)} className={'sidebar-link ' + (!isAdmin ? "hidden" : "") } >
                            <i className="fi fi-rr-file-edit"></i>
                            Quản lý User
                        </NavLink>

                        <h1 className="text-xl text-dark-grey mt-20 mb-3">Cài đặt</h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        <NavLink to="/setting/edit-profile" onClick={(e)=>setPageState(e.target.innerText)} className='sidebar-link'>
                            <i className="fi fi-rr-user"></i>
                            Chỉnh sửa thông tin
                        </NavLink>

                        <NavLink to="/setting/change-password" onClick={(e)=>setPageState(e.target.innerText)} className='sidebar-link'>
                            <i className="fi fi-rr-lock"></i>
                            Đổi mật khẩu
                        </NavLink>
                    </div>

                </div>

                <div className="max-md:mt-8 mt-5 w-full">
                    <Outlet/>
                </div>
            </section>
        </>
    )
}

export default SideNav;