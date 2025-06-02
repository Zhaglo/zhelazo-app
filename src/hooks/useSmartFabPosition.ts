import { useEffect, useState } from "react";

/**
 * возвращает true, когда футер попадает во viewport
 */
export default function useSmartFabPosition(footerSelector = "footer") {
    const [nearFooter, setNearFooter] = useState(false);

    useEffect(() => {
        const footer = document.querySelector(footerSelector);
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => setNearFooter(entry.isIntersecting),
            { root: null, threshold: 0.5 }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, [footerSelector]);

    return nearFooter;
}