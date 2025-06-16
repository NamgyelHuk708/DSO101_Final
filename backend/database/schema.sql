-- database/schema.sql
-- Initial database setup for BMI Calculator

DROP TABLE IF EXISTS bmi_records;

CREATE TABLE bmi_records (
  id SERIAL PRIMARY KEY,
  height DECIMAL NOT NULL COMMENT 'Height in meters',
  weight DECIMAL NOT NULL COMMENT 'Weight in kilograms',
  age INTEGER NOT NULL,
  bmi DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes if needed
CREATE INDEX idx_bmi_records_created_at ON bmi_records(created_at);