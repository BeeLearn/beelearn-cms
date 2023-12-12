"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";

import { useCookies } from "react-cookie";

import Api from "@/lib/api";

import store from "./store";
import FetchContext from "./FetchContext";


export default function Context({ children }: React.PropsWithChildren) {
    const [cookies] = useCookies(['accessToken']);

    useEffect(() => {
        const accessToken = cookies.accessToken;

        if (accessToken) {
            Api.accessToken = accessToken;
        } else
            window.location.replace(process.env.NEXT_PUBLIC_AUTH_BASE_URL + "?redirect=" + window.location.href)
    });

    return (
        <Provider store={store}>
            <FetchContext>
                {children}
            </FetchContext>
        </Provider>
    );
}