import React from 'react'
import InputBox from '../components/input.component'
import googleIcon from '../imgs/googleIcon.png'
import { Link } from 'react-router-dom'
import AnimationWrapper from '../common/page-animation'

const UserAuthForm = ({type}) => {
  return (
    <AnimationWrapper keyValue={type}>
        <section className='h-cover flex items-center justify-center'>
            <form className='w-[80%] max-w-[400px]'>
                <h1 className='text-4xl font-gelasio capitalize text-center mb-24'>
                    {type === 'sign-in' ? 'Chào mừng bạn trở lại!' : 'Đăng ký'}
                </h1>

                {
                    type !== 'sign-in' ?
                    <InputBox
                        name='fullname'
                        type='text'
                        placeholder={'Nhập họ và tên của bạn'}
                        icon={'fi-rr-user'}
                    />
                    :''
                }

                    <InputBox
                        name='email'
                        type='email'
                        placeholder={'Email'}
                        icon={'fi-rr-envelope'}
                    />

                    <InputBox
                        name='password'
                        type='password'
                        placeholder={'Mật khẩu'}
                        icon={'fi-rr-lock'}
                    />

                    <button
                        className='btn-dark center mt-14'
                        type='submit'
                        >
                            {type.replace('-', ' ')}

                    </button>

                    <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                        <hr className='w-1/2 border-black'/>
                        <span>hoặc</span>
                        <hr className='w-1/2 border-black'/>

                    </div>
                    <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
                        <img src={googleIcon}  className='w-9' />
                        Tiếp tục với Google
                    </button>

                    {
                        type == 'sign-in' ?
                        <p className='mt-6 text-dark-grey text-xl text-center'>
                            Bạn chưa có tài khoản?
                            <Link to='/signup' className='underline text-black text-xl ml-1'>
                                Đăng ký
                            </Link>
                        </p>
                        :
                        <p className='mt-6 text-dark-grey text-xl text-center'>
                            Bạn đã có tài khoản?
                            <Link to='/signin' className='underline text-black text-xl ml-1'>
                                Đăng nhập
                            </Link>
                        </p>
                    }
            </form>
        </section>
    </AnimationWrapper>
  )
}

export default UserAuthForm