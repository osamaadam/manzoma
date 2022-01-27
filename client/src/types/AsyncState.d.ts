export declare interface AsyncState<T> {
  data: T | null;
  status: "idle" | "pending" | "succeeded" | "failed" | "cleared";
  error?: string | null;
}
