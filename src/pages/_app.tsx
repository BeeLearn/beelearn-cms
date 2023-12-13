import '@unocss/reset/tailwind.css';
import '@unocss/reset/sanitize/assets.css';
import '@unocss/reset/sanitize/sanitize.css';
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import 'react-toastify/ReactToastify.css';

import type { AppProps } from "next/app";
import { Noto_Sans } from 'next/font/google';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { join } from "@/props";
import LayoutSideNavigation from "@/components/LayoutSideNavigation";

import '@/assets/global.css';
import Provider from '@/Provider';

const defaultFont = Noto_Sans({
    subsets: ['latin'],
    weight: ["300", "400", "700", "900"],
});


export default function App({ Component, ...pageProps }: AppProps) {
    const [cookies] = useCookies(['accessToken']);

    useEffect(() => {
        const accessToken = cookies.accessToken;
        // const accessToken = "32445674071e3c178df8b55fd22f9c45c7bdf171";

        if (!accessToken)
            window.location.replace(
                process.env.NEXT_PUBLIC_AUTH_BASE_URL +
                "?redirect=" + window.location.href
            );
    });

    return (
        <div className="fixed inset-0 flex flex-col text-[15px]">
            <Provider>
                <main className={join("flex-1 flex overflow-y-scroll", defaultFont.className)}>
                    <LayoutSideNavigation />
                    <section className="flex-1 flex flex-col space-y-4 bg-slate-100 overflow-auto">
                        <Component {...pageProps} />
                    </section>
                </main>
            </Provider>
        </div>
    );
}
