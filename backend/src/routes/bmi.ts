import { Router, Request, Response } from 'express';
import { errorHandler } from '../utils';
import knex from 'knex';
import { databaseConfig } from '../config';

const router = Router();
const db = knex(databaseConfig);

// GET /api/user/bmi - Fetch all BMI records
router.get('/user/bmi', errorHandler(async (req: Request, res: Response) => {
  const records = await db('bmi_records')
    .select('*')
    .orderBy('created_at', 'desc');
  
  res.json(records);
}));

// POST /api/create/bmi - Create new BMI record
router.post('/create/bmi', errorHandler(async (req: Request, res: Response) => {
  const { height, weight, age, bmi } = req.body;

  // Validate required fields
  if (!height || !weight || age === undefined || !bmi) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields (height, weight, age, bmi) are required'
    });
  }

  // Convert to numbers
  const heightNum = Number(height);
  const weightNum = Number(weight);
  const ageNum = Number(age);
  const bmiNum = Number(bmi);

  // Validate numeric values with proper parentheses
  if (isNaN(heightNum)) throw new Error('Height must be a number');
  if (isNaN(weightNum)) throw new Error('Weight must be a number');
  if (isNaN(ageNum)) throw new Error('Age must be a number');
  if (isNaN(bmiNum)) throw new Error('BMI must be a number');

  try {
    const [record] = await db('bmi_records')
      .insert({
        height: heightNum,
        weight: weightNum,
        age: ageNum,
        bmi: bmiNum,
        created_at: new Date()
      })
      .returning('*');

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Database error';
    console.error('Create error:', errorMessage);
    res.status(500).json({
      success: false,
      message: 'Failed to create BMI record'
    });
  }
}));

// DELETE /api/user/bmi/:id - Delete a BMI record
router.delete('/user/bmi/:id', errorHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'Valid record ID is required'
    });
  }

  try {
    const deletedCount = await db('bmi_records')
      .where({ id: Number(id) })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Database error';
    console.error('Delete error:', errorMessage);
    res.status(500).json({
      success: false,
      message: 'Failed to delete record'
    });
  }
}));

export default router;