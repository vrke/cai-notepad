export class BaseIONode {
  constructor(io) {
    this.io = io;
  }

  get root() {
    return this.io.root;
  }

  get headers() {
    return this.io.headers;
  }

  handleFault(v) {
    if (v.ok)
      return v;
    console.error('Error', v);
    throw {
      status: v.status,
      statusText: v.statusText
    }
  }

}
