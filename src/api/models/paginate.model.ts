export default interface Paginate<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
