import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/404.png"
import HIVAppLogo from "../imgs/HIVApp.png"

const PageNotFound = () => {
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img src={pageNotFoundImage} alt="page-not-found" className="w-72 h-full object-cover select-none border-grey aspect-square rounded " />
            <h1 className="text-4xl font-gelasio leading-5">Opps! Hình như có lỗi!</h1>
            <p className="text-dark-grey text-xl leading-5 mt-2">Trang bạn đang tìm kiếm không tồn tại. Hãy kiểm tra lại đường dẫn hoặc trở lại <Link to="/" className="text-black underline">trang chủ.</Link></p>

            <div className="mt-auto">
                <img src={HIVAppLogo} alt="HIVAppLogo" className="h-10 object-contain block mx-auto select-none" />
                <p className="text-dark-grey mt-5">© 2025 HIVApp. All rights reserved.</p>
            </div>

        </section>
    )
}

export default PageNotFound;