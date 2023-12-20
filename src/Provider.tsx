import { Provider } from "react-redux";

import store from "@/store";
import { getCurrentUser } from "@/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";

export default function StoreProvider({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <Fetch>{children}</Fetch>
    </Provider>
  );
}

function Fetch({ children }: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCurrentUser()).then(() => console.log(state));
  }, []);

  return (
    <>
      {["pending", "idle", "failed"].includes(state.state) ? (
        <div className="m-auto s-8 progress progress-primary" />
      ) : (
        <AuthGuard>{children}</AuthGuard>
      )}
    </>
  );
}

function AuthGuard({ children }: React.PropsWithChildren) {
  const state = useAppSelector((state) => state.user);

  useEffect(() => {
    if (state.user && !state.user.is_staff)
      return window.location.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  }, [state]);

  return children;
}

