import { useState } from "react";
import { toast } from "react-toastify";

import { PropsWithClassName, join } from "@/props";

type LoadMoreProps = {
    onClick: () => Promise<void>,
} & PropsWithClassName;

export default function LoadMore({ onClick, className }: LoadMoreProps) {
    const [loading, setLoading] = useState(false);

    return (
        <div className={join("flex items-center justify-center p-4", className)}>
            <button
                disabled={loading}
                className="btn btn-primary"
                onClick={async () => {
                    setLoading(true);

                    try {
                        await onClick();
                    } catch (error) {
                        toast.error("Can't fetch data now, try again!.");
                    } finally {
                        setLoading(false);
                    }
                }}>
                {
                    loading &&
                    <div className="w-6 h-6 progress border-white border-t-violet-700" />
                }
                <span>Load More</span>
            </button>
        </div>
    );
}