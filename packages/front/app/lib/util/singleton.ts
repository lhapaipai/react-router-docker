const __singletons = new Map<string, any>();

export function singleton<T>(name: string, factory: () => T): T {
  const globalStore = global as any;

  globalStore.__singletons ??= new Map<string, unknown>();
  if (!__singletons.has(name)) {
    __singletons.set(name, factory());
  }
  return __singletons.get(name);
}
