import React from "react";
import { ToastContainer } from "react-toastify";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import { DialogElement, DialogEvent, VoidCallback } from "@/global";
import { PropsWithClassName, join } from "@/props";

type DialogProps = {
  open?: boolean;
  overlayClassName?: string;
} & PropsWithClassName &
  React.PropsWithChildren &
  React.HTMLAttributes<HTMLDivElement>;

export default React.forwardRef<DialogElement, DialogProps>(function Dialog(
  { open, className, overlayClassName, children, ...props },
  ref
) {
  const [isOpen, setIsOpen] = React.useState(open);
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const mapListeners = new Map<string, VoidCallback[]>([
    ["close", []],
    ["open", []],
  ]);

  const onClose = function () {};

  React.useImperativeHandle(
    ref,
    () => {
      return {
        close() {
          setIsOpen(false);
          this.notifyListeners("close");
        },
        showModal() {
          setIsOpen(true);
          this.notifyListeners("open");
        },
        addListener(event: string, listener: VoidCallback) {
          let listeners = mapListeners.get(event);

          if (!listeners) {
            listeners = [];
            mapListeners.set(event, listeners);
          }

          listeners.push(listener);
        },
        removeListener(event: string, listener: VoidCallback) {
          const listeners = mapListeners.get(event)!;
          const index = listeners.indexOf(listener);
          if (index > -1) listeners.splice(index, 1);
        },
        notifyListeners(event: string) {
          const listeners = mapListeners.get(event);
          if (listeners) for (const listener of listeners) listener();
        },
      };
    },
    []
  );

  return (
    <SwitchTransition>
      <CSSTransition
        key={isOpen ? 1 : 0}
        nodeRef={nodeRef}
        in={isOpen}
        timeout={500}
        classNames={{
          enter: "bounce-in",
          exit: "bounce-out",
        }}
        addEndListener={(done) =>
          nodeRef.current!.addEventListener("transitionend", done, false)
        }
      >
        <>
          {isOpen && (
            <div
              ref={nodeRef}
              {...props}
              className={join("dialog z-10", overlayClassName)}
            >
              <div className={join("modal flex flex-col space-y-4", className)}>
                {children}
              </div>
              <ToastContainer position="top-left" className="z-100" />
            </div>
          )}
        </>
      </CSSTransition>
    </SwitchTransition>
  );
});

