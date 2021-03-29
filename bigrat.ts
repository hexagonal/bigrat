const abs = (n: bigint) => n < 0n ? -n : n;

const g = (m: bigint, n: bigint): bigint => {
  if (n === 0n) { return m; }
  return g(n, m % n);
}

const gcd = (m: bigint, n: bigint): bigint => g(abs(m), abs(n));

export class BigRat {
  top: bigint;
  bottom: bigint;

  constructor(top: bigint, bottom: bigint = 1n) {
    if (bottom === 0n) { throw new RangeError("Fraction: bottom must not be zero."); }

    // Reduce the fraction to its canonical form
    // Divide top and bottom by their G.C.D.
    let d = gcd(top, bottom);
    top /= d;
    bottom /= d;

    // Only the top can be negative
    // If the bottom is negative, makes both signs opposite
    if (bottom < 0n) {
      top = -top;
      bottom = -bottom;
    }

    this.top = top;
    this.bottom = bottom;

    Object.freeze(this);
  }

  static zero(): BigRat { return new BigRat(0n); }
  static one(): BigRat { return new BigRat(1n); }

  equals({ top, bottom }: BigRat): boolean {
    return this.top === top && this.bottom === bottom;
  }

  plus({ top, bottom }: BigRat): BigRat {
    return new BigRat(this.top * bottom + this.bottom * top, this.bottom * bottom);
  }

  opposite(): BigRat {
    return new BigRat(-this.top, this.bottom);
  }

  minus(x: BigRat): BigRat {
    return this.plus(x.opposite());
  }

  times({ top, bottom }: BigRat): BigRat {
    return new BigRat(this.top * top, this.bottom * bottom);
  }

  reciprocal(): BigRat {
    return new BigRat(this.bottom, this.top);
  }

  divide(x: BigRat): BigRat {
    return this.times(x.reciprocal());
  }

  round(): bigint {
	  let quotient = this.top / this.bottom;
	  let remainder = this.top % this.bottom;
	  let isRounded = abs(remainder) >= abs(this.bottom) - abs(remainder);

    if (!isRounded) return quotient;

    let signedOne = remainder >= 0 ? 1n : -1n;
	  return quotient + signedOne;
  }
  
  toString() {
    return `${this.top}/${this.bottom}`;
  }
}
