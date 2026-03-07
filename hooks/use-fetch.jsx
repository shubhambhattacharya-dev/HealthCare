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
        } catch (error) {
            setError(error);
            toast.error(error.message);
            
        } finally{
            setLoading(false);
        }
    }

    return { data, loading, error, fn, setData };
}

export default useFetch;