class OpIterator {
  ops: Op[];
  index: number;
  offset: number;

  constructor(ops: Op[]) {
    this.ops = ops;
    this.index = 0;
    this.offset = 0;
  }

  hasNext(): boolean {
    return this.peekLength() < Infinity;
  }

  next(length?: number): Op {
    if (!length) {
      length = Infinity;
    }
    const nextOp = this.ops[this.index];
    if (nextOp) {
      const offset = this.offset;
      const opLength = Op.length(nextOp);
      if (length >= opLength - offset) {
        length = opLength - offset;
        this.index += 1;
        this.offset = 0;
      } else {
        this.offset += length;
      }
      if (typeof nextOp.delete === 'number') {
        return { delete: length };
      } else {
        const retOp: Op = {};
        if (nextOp.attributes) {
          retOp.attributes = nextOp.attributes;
        }
        if (typeof nextOp.retain === 'number') {
          retOp.retain = length;
        } else if (typeof nextOp.retain === 'object' && nextOp.retain !== null) {
          retOp.retain = nextOp.retain;
        } else if (typeof nextOp.insert === 'string') {
          retOp.insert = nextOp.insert.substr(offset, length);
        } else {
          retOp.insert = nextOp.insert;
        }
        return retOp;
      }
    } else {
      return { retain: Infinity };
    }
  }

  peek(): Op {
    if (this.index >= this.ops.length) {
      return { retain: Infinity };
    }
    return this.ops[this.index];
  }

  peekLength(): number {
    if (this.index >= this.ops.length) {
      return Infinity;
    }
    return Op.length(this.ops[this.index]) - this.offset;
  }

  peekType(): string {
    if (this.index >= this.ops.length) {
      return 'retain';
    }
    if (typeof this.ops[this.index].delete === 'number') {
      return 'delete';
    } else if (typeof this.ops[this.index].retain === 'number') {
      return 'retain';
    } else {
      return 'insert';
    }
  }
  ...
}