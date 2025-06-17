import { useState } from "react";
import AnimationWrapper from "../common/page-animation";

const LoadMore = ({ currentPage, totalPages, onLoadMore }) => {
    const [loading, setLoading] = useState(false);

    const handleLoadMore = async () => {
        setLoading(true);
        await onLoadMore();
        setLoading(false);
    };

    if (currentPage >= totalPages) {
        return null;
    }

    return (
        <AnimationWrapper>

        <div className="flex justify-center mt-8">
            <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-dark flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="animate-spin">⟳</span>
                        Đang tải...
                    </>
                ) : (
                    <>
                        Tải thêm bài viết
                        <i className="fi fi-rr-arrow-down"></i>
                    </>
                )}
            </button>
        </div>
        </AnimationWrapper>
    );
};

export default LoadMore;
