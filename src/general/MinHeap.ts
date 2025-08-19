export class MinHeap<T> {
  #array: { k: number; v: T }[] = [];

  get length() { return this.#array.length; }

  push(k: number, v: T) {
    this.#array.push({ k, v });
    this.#bubbleUp(this.#array.length - 1);
  }

  pop(): { k: number; v: T } | undefined {
    if (this.#array.length === 0) return undefined;
    const out = this.#array[0];
    const last = this.#array.pop()!;
    if (this.#array.length) {
      this.#array[0] = last; this.#bubbleDown(0);
    }
    return out;
  }

  peek(): { k: number; v: T } | undefined {
    return this.#array[0];
  }

  #bubbleUp(i: number) {
    while (i > 0) {
      // get parent index
      const p = (i - 1) >> 1;
      // swap if the value is smaller than the parent's value
      if (this.#array[p].k <= this.#array[i].k) { break; }
      [this.#array[p], this.#array[i]] = [this.#array[i], this.#array[p]];
      i = p;
    }
  }

  #bubbleDown(i: number) {
    while (true) {
      // get left and right indices
      const l = i * 2 + 1;
      const r = l + 1;
      let m = i;
      // find the smaller of the two
      if (l < this.#array.length && this.#array[l].k < this.#array[m].k) { m = l; }
      if (r < this.#array.length && this.#array[r].k < this.#array[m].k) { m = r; }
      if (m === i) { break; }
      [this.#array[m], this.#array[i]] = [this.#array[i], this.#array[m]];
      i = m;
    }
  }
}

