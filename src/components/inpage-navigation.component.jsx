import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {

     activeTabLineRef = useRef();
     activeTabRef = useRef();

    let [inPgaeNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const changePageState = (btn, index) => {

        let { clientWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = `${clientWidth}px`;
        activeTabLineRef.current.style.transform = `translateX(${offsetLeft}px)`;

        setInPageNavIndex(index);
    }

    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex);
    }, []);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {
                    routes.map((route, index) => {
                        return (
                            <button 
                                key={index}
                                ref={index === defaultActiveIndex ? activeTabRef : null}
                                className={"p-4 px-5 capitalize " + (inPgaeNavIndex === index ? "text-black" : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden" : "")}
                                onClick={(e) => {changePageState(e.target, index)}}
                            >
                                {route}
                            </button>
                        )
                    })
                }

                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300"/>
            </div>
            {Array.isArray(children) ? children[inPgaeNavIndex] : children}
        </>
    )
}

export default InPageNavigation;