export type VoidCallback = () => void;
type DialogEvent = "open" | "close";

export type ExposeListener<T extends string = string> = {
  notifyListeners: (event: T) => void;
  addListener: (event: T, listener: VoidCallback) => void;
  removeListener: (event: T, listener: VoidCallback) => void;
};

export type DialogElement = {
  close: () => void;
  showModal: () => void;
} & React.HTMLAttributes<HTMLDivElement> &
  ExposeListener<DialogElement>;

export type ResetElementProps = {
  reset: () => void;
};

