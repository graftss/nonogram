import { validateSegment } from './validate';

describe('validateSegment', () => {
  it('should accept a met constraint of length 1', () => {
    expect(validateSegment([1, 1], [2])).toBe(true);
    expect(validateSegment([1, 1, 0, 0], [2])).toBe(true);
    expect(validateSegment([0, 0, 1, 1, 0, 0], [2])).toBe(true);
  });

  it('should reject an unmet constraint of length 1', () => {
    expect(validateSegment([1, 1], [1])).toBe(false);
    expect(validateSegment([1, 1], [3])).toBe(false);
    expect(validateSegment([0, 1, 1], [3])).toBe(false);
    expect(validateSegment([1, 1, 0], [1])).toBe(false);
    expect(validateSegment([1, 1, 0], [3])).toBe(false);
    expect(validateSegment([0, 1, 1, 0], [3])).toBe(false);
    expect(validateSegment([1, 1, 0, 0, 0], [1])).toBe(false);
    expect(validateSegment([1, 1, 0, 0, 0], [3])).toBe(false);
    expect(validateSegment([0, 1, 1, 0, 0, 0], [3])).toBe(false);
  });

  it('should accept a met constraint of length 2', () => {
    expect(validateSegment([1, 1, 0, 1], [2, 1])).toBe(true);
    expect(validateSegment([1, 1, 0, 1, 1, 1], [2, 3])).toBe(true);
    expect(validateSegment([1, 1, 0, 1, 1, 1, 0, 0], [2, 3])).toBe(true);
    expect(validateSegment([0, 0, 1, 1, 0, 1, 1, 1, 0, 0], [2, 3])).toBe(true);
  });

  it('should reject an unmet constraint of length 2', () => {
    expect(validateSegment([1, 1, 0, 1], [2, 2])).toBe(false);
    expect(validateSegment([0, 1, 1, 0, 1, 0], [2, 2])).toBe(false);
    expect(validateSegment([0, 1, 1, 0, 1, 1, 0, 1], [2, 2])).toBe(false);
    expect(validateSegment([1, 0, 1, 1, 0, 1, 1], [2, 2])).toBe(false);
  });

  it('should accept a long met constraint', () => {
    expect(validateSegment(
      [1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
      [2, 1, 5, 1],
    )).toBe(true);
  });

  it('should reject a long unmet constraint', () => {
    expect(validateSegment(
      [1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0],
      [2, 1, 5, 1, 1],
    )).toBe(false);
  });
});
