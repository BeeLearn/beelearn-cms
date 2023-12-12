"use client";
import LayoutSideNavigation from "@/components/LayoutSideNavigation";

export default function RootTemplate({ children }: React.PropsWithChildren) {

    return (
        <main className="flex-1 flex overflow-y-scroll">
            <LayoutSideNavigation />
            <section className="flex-1 flex flex-col space-y-4 bg-slate-100 overflow-auto">
                {children}
            </section>
        </main>
    );
}