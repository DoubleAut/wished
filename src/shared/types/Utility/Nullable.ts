export type Nullable<T> = Partial<Omit<T, keyof T>> & Pick<T, keyof T>;
