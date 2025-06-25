import React, { useContext, useState } from 'react';
import logo from '../imgs/logo.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import UserNavigationPanel from './user-navigation.component';
import UserAvatar from './user-avatar';

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [ userNavPanel, setUserNavPanel ] = useState(false);

    let navigate = useNavigate();

    const handleUserNavPanel =()=>{
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleSearch = (e) => {

        let query = e.target.value;
        if(e.key === 'Enter' && query.length){
            console.log({query});
            navigate(`/search/${query}`);
        }
    }

    const handleBlur = ()=>{
        setTimeout(()=>{
            setUserNavPanel(false);
        }, 200)
    }
    const {userAuth, userAuth:{accessToken, profileImg}}= useContext(UserContext);
  return (
    <>
    <nav className='navbar z-50'>
        <Link to="/" className='flex-none w-10'>
        <   img src={logo} className='flex-none w-10' alt="" />
        </Link>

        <div className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (searchBoxVisibility ? 'show' : 'hide')}>
            <input
                type="text"
                placeholder='Tìm kiếm...'
                className='w-full md:w-auto bg-grey p-4 pl-16 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                onKeyDown={handleSearch}
                />
                <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>

        </div>

        <div className='flex items-center gap-3 md:gap-6 ml-auto'>
            <button className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
                onClick={()=>setSearchBoxVisibility(currentVal => !currentVal)}>
            <i class="fi fi-br-search text-xl"></i>
            </button>

            <Link to='/editor' className='hidden md:flex gap-2 link'>
            <i className="fi fi-rr-file-edit"></i>
                <p>
                    Bài đăng mới
                </p>
            </Link>

            {
                accessToken ?
                <>
                    {/* <Link to="/dashboard/notification">
                        <button className='relative w-12 h-12 rounded-full bg-grey hover:bg-back/10'>
                            <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                        </button>
                    </Link> */}

                    <div className='relative' onClick={handleUserNavPanel} onBlur={handleBlur}>
                        <button className='w-12 h-12 mb-[0.8]'>
                            <UserAvatar name={userAuth.user.fullName} size={42} />
                        </button>
                        {
                            userNavPanel ? <UserNavigationPanel/>
                            : ''

                        }
                        
                    </div>
                </>
                :
                <>
                 <Link className='btn-dark py-2' to='/signin'>
                Đăng nhập
                </Link>
                <Link className='btn-light py-2 hidden md:block' to='/signup'>
                Đăng ký
            </Link>
                </>
            }

            
        </div>
    </nav>
    <Outlet />
    </>
  )
}

export default Navbar