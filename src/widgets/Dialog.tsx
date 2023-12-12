import React from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import { DialogElement } from "@/global";
import { PropsWithClassName, join } from "@/props";

type DialogProps = {
    open?: boolean,
    overlayClassName?: string,
} & PropsWithClassName & React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>;


export default React.forwardRef<DialogElement, DialogProps>(
    function Dialog({ open, className, overlayClassName, children, ...props }, ref) {
        const [isOpen, setIsOpen] = React.useState(open);
        const nodeRef = React.useRef<HTMLDivElement>(null);

        React.useImperativeHandle(ref, () => {
            return {
                close() {
                    setIsOpen(false);
                },
                showModal() {
                    setIsOpen(true);
                },
            };
        }, []);

        return (
            <SwitchTransition>
                <CSSTransition
                    key={isOpen ? 1 : 0}
                    nodeRef={nodeRef}
                    in={isOpen}
                    timeout={500}
                    classNames={
                        {
                            enter: "bounce-in",
                            exit: "bounce-out"
                        }
                    }
                    addEndListener={(done) => nodeRef.current!.addEventListener("transitionend", done, false)}>
                    <>
                        {isOpen && <div
                            ref={nodeRef}
                            {...props}
                            className={join("dialog z-20", overlayClassName)}>
                            <div className={join("modal flex flex-col space-y-4", className)}>
                                {children}
                            </div>
                        </div>
                        }
                    </>
                </CSSTransition>
            </SwitchTransition>
        );
    },
);