import { useState, useEffect } from "react";

function useViewPort(breakpoint: number = 768) {
    const [isVerticalLayout, setIsVerticalLayout] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth < breakpoint;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            setIsVerticalLayout(window.innerWidth < breakpoint);
        };

        handleResize(); // Initialize the value
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [breakpoint]);

    return isVerticalLayout;
}

export default useViewPort;
