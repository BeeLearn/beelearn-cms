export type LoadingState = {
  state: "idle" | "pending" | "failed" | "success";
};

export type PaginateState = {
  count: number;
  next?: string | null;
  previous?: string | null;
};

export type BreadCrumbState<T> = {
  breadcrumb?: T;
};
