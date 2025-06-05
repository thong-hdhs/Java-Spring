import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { removeFromSession } from '../common/session'

const UserNavigationPanel = () => {
    const context = useContext(UserContext);
    console.log('UserContext value:', context);
    
    const{userAuth:{user}, setUserAuth}= context;
    console.log('userAuth value:', context.userAuth);

    const signOutUser = ()=> {
        removeFromSession('user');
        setUserAuth({accessToken: null})
    }
  return (
    <AnimationWrapper
        className='absolute right-0 z-50'
        transition={{ duration:0.2}}
    >

        <div className='bg-white absolute right-0 border border-grey w-60 overflow-hidden duration-200'>
            <Link to="/editor" className='flex gap-2 link md:hidden pl-8 py-4'>
                <i className='fi fi-rr-file-edit'></i>
                <p>Bài viết mới</p>
            </Link>

            <Link to={`/users/${user?.email}`} className='link text-left pl-8 py-4'>
            Trang cá nhân
            </Link>

            <Link to='/dashboard/blogs' className='link text-left pl-8 py-4'>
            Dashboard
            </Link>

            <Link to='/setting/edit-profile' className='link text-left pl-8 py-4'>
            Cài đặt
            </Link>

            <span className='absolute border-t border-grey ml-6 w-[100%]'>

            </span>

            <button className='text-left p-4 hover:bg-grey w-full pl-8 py-4'
                onClick={signOutUser}
            >
                <h1 className='font-bold text-xl mg-1'>Sign out</h1>
                <p className='text-dark-grey mt-1'>{user?.fullName}</p>
            </button>
        </div>
    </AnimationWrapper>
  )
}

export default UserNavigationPanel