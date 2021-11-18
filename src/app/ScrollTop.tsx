import {useEffect, useState} from "react";
import "../scrollTop.css";

export const ScrollTop = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>

            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="btn btn-primary border-0 rounded-circle"
                    id="scroll-to-top-btn"
                >
                    <i className="arrow up" />
                </button>
            )}
        </>
    )
}