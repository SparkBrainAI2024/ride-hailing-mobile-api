export function ignore(promise: Promise<any>, onError?: (err: any) => void): void {
  void promise.catch((err) => {
    if (onError) onError(err);
  });
}

export function ignoreAll(promises: Promise<any>[], onError?: (err: any) => void): void {
  void promises.forEach((promise) => {
    ignore(promise, onError);
  });
}
