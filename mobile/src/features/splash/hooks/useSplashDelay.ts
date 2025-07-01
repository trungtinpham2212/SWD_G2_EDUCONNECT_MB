import { useEffect, useState } from 'react';

export const useSplashDelay = (delayMs: number = 2000): boolean => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, delayMs);

        return () => clearTimeout(timer); // cleanup nếu component bị hủy
    }, [delayMs]);

    return loading;
};
