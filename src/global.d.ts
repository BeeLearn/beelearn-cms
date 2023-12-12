export type DialogElement = {
    close: () => void,
    showModal: () => void,
} & React.HTMLAttributes<HTMLDivElement>;

export type ResetElementProps = {
    reset: () => void,
};