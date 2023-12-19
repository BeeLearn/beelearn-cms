import { useRef, forwardRef, useImperativeHandle } from "react";

import { DialogElement } from "@/global";

import Dialog from "@/widgets/Dialog";

type ConfirmDeleteDialogProps = {
  onDelete: () => Promise<void>;
} & React.PropsWithChildren;

export default forwardRef<Partial<DialogElement>, ConfirmDeleteDialogProps>(
  function ConfirmDeleteDialog({ onDelete, children }, ref) {
    const dialogRef = useRef<DialogElement>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          close: () => dialogRef.current!.close(),
          showModal: () => dialogRef.current!.showModal(),
          addListener: (
            ...args: Parameters<typeof dialogRef.current.addListener>
          ) => dialogRef.current!.addListener(...args),
          removeListener: (
            ...args: Parameters<typeof dialogRef.current.removeListener>
          ) => dialogRef.current!.removeListener(...args),
        };
      },
      []
    );

    return (
      <Dialog
        ref={dialogRef}
        overlayClassName="justify-center items-center"
        className="alert-dialog !p-0"
      >
        <section className="flex-1 flex flex-col p-4 overflow-y-scroll">
          {children}
        </section>
        <footer className="flex border-t-1">
          <button
            className="flex-1 btn border-r-1 text-stone-700"
            onClick={() => dialogRef.current!.close()}
          >
            Cancel
          </button>
          <button
            className="flex-1 btn text-red"
            onClick={async () => {
              await onDelete().then(() =>
                dialogRef.current!.notifyListeners("delete")
              );

              dialogRef.current!.close();
            }}
          >
            Delete
          </button>
        </footer>
      </Dialog>
    );
  }
);

