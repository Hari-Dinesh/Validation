const express = require('express');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Format error message
  return `${location}[${param}]: ${msg}`;
};
app.post('/validate', [
  // Validation rules
  body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // Additional custom validation
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes
  res.status(200).json({ message: 'Validation successful' });
});


app.post('/validate', [
    // Validation rules
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ], (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // If validation passes
    res.status(200).json({ message: 'Validation successful' });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
