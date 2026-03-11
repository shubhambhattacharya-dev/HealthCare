import { toast } from "sonner";
import { useState } from "react";

const useFetch = (cp) => {

    // 3 stage
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const fn = async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cp(...args);
            setData(response);
            setLoading(false);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
            throw err;
        }
    }

    return { data, loading, error, fn, setData };
}

export default useFetch;
