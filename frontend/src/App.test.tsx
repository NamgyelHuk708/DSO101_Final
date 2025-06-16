import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import BMICalculator from './App';

test('calculates BMI correctly', () => {
  render(<BMICalculator />);
  
  // Fill the form
  fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '175' } });
  fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '70' } });
  
  // Trigger calculation
  fireEvent.click(screen.getByText(/Calculate/i));
  
  // Check result
  expect(screen.getByText(/22.86/)).toBeInTheDocument();
  expect(screen.getByText(/Normal weight/)).toBeInTheDocument();
});