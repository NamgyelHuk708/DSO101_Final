# Final Project Report - Continuous Integration and Continuous Deployment

**Course:** DSO101  
**Student:** [Your Name]

## 1. Introduction

The project involved enhancing a **PERN stack (PostgreSQL, Express, React, Node.js)** application by implementing a **BMI Calculator** feature. The goal was to add input fields for height, weight, and age, calculate BMI, store the data in a database, and ensure proper testing using **Jest**.

## 2. Implemented Changes

### A. Database Schema & Configuration

#### Table Schema (`bmi_records`)

```sql
CREATE TABLE bmi_records (
  id SERIAL PRIMARY KEY,
  height DECIMAL NOT NULL COMMENT 'Height in meters',
  weight DECIMAL NOT NULL COMMENT 'Weight in kilograms',
  age INTEGER NOT NULL,
  bmi DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on creation time
CREATE INDEX idx_bmi_records_created_at ON bmi_records(created_at);
```

#### Database Configuration (`knexfile.js`)

```javascript
module.exports = {
  client: 'pg',
  version: '12',
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false }
  },
  pool: { min: 1, max: 2 },
  migrations: { tableName: 'knex_migrations' },
  debug: true
};
```

**Key Features:**
- **Structured storage** for BMI data (height in meters, weight in kg, age, calculated BMI)
- **Timestamps** to track record creation
- **Indexing** for optimized query performance

### B. Backend (Express/Node.js) Testing

#### Tested Functionality

1. **BMI Calculation Logic**
   - Validated correct BMI computation (`weight / (height²)`)
   - Tested edge cases (zero/negative inputs)

2. **API Endpoints**
   - `POST /api/create/bmi`
     - Input validation (rejects missing/negative values)
     - Correctly stores data in PostgreSQL
   - `GET /api/user/bmi`
     - Returns all records in descending chronological order
   - `DELETE /api/user/bmi/:id`
     - Validates ID format
     - Handles non-existent records gracefully

3. **Error Handling**
   - Returns `400 Bad Request` for invalid inputs
   - Returns `500 Internal Server Error` for database failures

####  Test Cases (Jest)

```javascript
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
```
![alt text](image/1.png)

### C. Frontend (React) Changes

- Added form inputs for **height (cm), weight (kg), age**
- Implemented **real-time BMI calculation**
- Integrated with backend APIs to **save/fetch/delete** records
- Added user-friendly **error messages** and **success feedback**

### D. CI/CD Implementation Plan

- **Test Automation**: Jest validates core logic
- **Database Migrations**: Managed via Knex
- **Environment Config**: Uses `process.env` for credentials

## 3. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| PostgreSQL connection issues | Used `ssl: { rejectUnauthorized: false }` for local testing |
| Empty Jest test files | Added minimal test cases or removed unused files |
| Input validation edge cases | Added checks for negative/zero values in backend |

## 4. Current Status

The project has successfully implemented:
- Integrated a **BMI Calculator** with database persistence
- Implemented **RESTful APIs** for CRUD operations
- Ensured **data validity** through backend checks
- Included **automated tests** for critical functionality