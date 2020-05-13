class Exception extends Error {

  constructor(public code: number, public message: string, public source?: string, public params?: any) {
    super();
  }

}

export { Exception };
