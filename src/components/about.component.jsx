import { getFullDay } from "../common/date";

const AboutUser = ({createAt, gender, className}) => {
    return (
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <div className="flex gap-x-7 gap-y-1 flex-wrap my-1 items-center text-dark-grey">
                <p>{gender || 'Không xác định'}</p>
            </div>
            <p className="text-m leading-7 text-dark-grey">Đã tham gia vào {getFullDay(createAt)}</p>
        </div>
    )
}
export default AboutUser;