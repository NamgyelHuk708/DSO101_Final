// backend/tests/bmiCalculator.test.js
const { calculateBMI } = require('../utils/bmiCalculator');

describe('BMI Calculator', () => {
  test('calculates BMI correctly for normal values', () => {
    // Test case 1: Normal values
    const height = 175; // cm
    const weight = 70; // kg
    const expectedBMI = 22.86; // 70 / (1.75 * 1.75)
    
    const result = calculateBMI(height, weight);
    expect(result).toBeCloseTo(expectedBMI, 2);
  });

  test('calculates BMI correctly for edge cases', () => {
    // Test case 2: Very tall
    expect(calculateBMI(200, 80)).toBeCloseTo(20.0, 2);
    
    // Test case 3: Very short
    expect(calculateBMI(150, 50)).toBeCloseTo(22.22, 2);
  });

  test('returns NaN for invalid inputs', () => {
    // Test case 4: Zero height
    expect(calculateBMI(0, 70)).toBeNaN();
    
    // Test case 5: Negative weight
    expect(calculateBMI(170, -50)).toBeNaN();
  });
});