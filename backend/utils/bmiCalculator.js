// backend/utils/bmiCalculator.js
function calculateBMI(heightCm, weightKg) {
  // Convert height from cm to meters
  const heightM = heightCm / 100;
  
  // Check for invalid inputs
  if (isNaN(heightCm)) return NaN;
  if (isNaN(weightKg)) return NaN;
  if (heightCm <= 0) return NaN;
  if (weightKg <= 0) return NaN;
  
  // Calculate BMI (weight / height^2)
  const bmi = weightKg / (heightM * heightM);
  return parseFloat(bmi.toFixed(2));
}

module.exports = { calculateBMI };