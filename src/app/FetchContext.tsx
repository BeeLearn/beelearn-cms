import { useEffect } from "react";

import { getCurrentUser } from "@/features/userSlice";

import { useAppDispatch, useAppSelector } from "./hooks";

export default function FetchContext({ children }: React.PropsWithChildren) {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.user);

    useEffect(() => {
        dispatch(getCurrentUser());
    }, []);

    return (
        <>
            {
                ["pending", "idle", "failed"].includes(state.state) ?
                    <div className="m-auto s-8 progress progress-primary" />
                    : children
            }
        </>
    );
}
