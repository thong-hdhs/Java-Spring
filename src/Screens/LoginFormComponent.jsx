import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function LoginFormComponent() {
  // State để quản lý form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // State để quản lý lỗi
  const [errors, setErrors] = useState({})

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Xử lý đăng nhập ở đây
      console.log('Form data:', formData)
    }
  }

  // Xử lý đăng nhập bằng Google
  const handleGoogleSignIn = () => {
    // Xử lý đăng nhập Google ở đây
    console.log('Google sign in clicked')
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img 
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto" 
              alt="Logo"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Đăng nhập
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow-lg hover:bg-indigo-200 hover:scale-105 focus:shadow-sm focus:shadow-outline">
                  <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4" />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853" />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04" />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335" />
                    </svg>
                  </div>
                  <span className="ml-4">
                    Đăng nhập với Google
                  </span>
                </button>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Hoặc đăng nhập bằng email
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                <input
                  className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email" 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                
                <input
                  className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${errors.password ? 'border-red-500' : 'border-gray-200'} placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5`}
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu" 
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-600 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">
                    Đăng nhập
                  </span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="border-b border-gray-500 border-dotted hover:text-indigo-500 hover:border-indigo-500 transition-colors duration-300">
                    Đăng ký ngay
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div 
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default LoginFormComponent 