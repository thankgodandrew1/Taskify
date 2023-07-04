const { body } = require('express-validator');
const phoneNumberPattern = /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
const usernamePattern = /^[a-zA-Z0-9_]+$/;

exports.validateRoutes = (entity) => {
  switch (entity) {
    // Code case Taskify users POST and PUT routers validation!
    case 'createUser':
      return [
        body('name').notEmpty().withMessage('The name field is required'),
        body('name')
          .isLength({ min: 5, max: 50 })
          .withMessage('The name must be between 2 and 50 characters long'),
        body('name')
          .matches(/^[A-Za-z\s'-]+$/)
          .withMessage('The name field can only contain letters, spaces, hyphens, and apostrophes'),
        body('email')
          .notEmpty()
          .withMessage('The email field is required')
          .isEmail()
          .withMessage('Invalid email'),
        body('username')
          .notEmpty()
          .withMessage('Required! Please enter a username')
          .custom(async (value, { req }) => {
            const { usersCollection } = req.app.locals;
            const user = await usersCollection.findOne({ username: value });
            if (user) {
              throw new Error('Username already exists');
            }
          })
          .isLength({ min: 5, max: 20 })
          .withMessage('Username must be between 5 and 20 characters')
          .matches(usernamePattern)
          .withMessage('Username can only contain letters, numbers, and underscores'),
        body('password')
          .notEmpty()
          .withMessage('Password is requires')
          .isStrongPassword()
          .withMessage(
            'Please enter a strong password. It must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
          ),
        body('role').notEmpty().withMessage('The role field is required'),
        body('phoneNumber')
          .notEmpty()
          .withMessage('The phne number is required')
          .matches(phoneNumberPattern)
          .withMessage('Please enter a valid phone number'),
        body('address')
          .notEmpty()
          .withMessage('Address is required')
          .isLength({ min: 5, max: 150 })
          .withMessage('Address must be between 5 and 150 characters')
      ];
    case 'updateUser': {
      return [
        body('name').notEmpty().withMessage('The name field is required'),
        body('name')
          .isLength({ min: 5, max: 50 })
          .withMessage('The name must be between 2 and 50 characters long'),
        body('name')
          .matches(/^[A-Za-z\s'-]+$/)
          .withMessage('The name field can only contain letters, spaces, hyphens, and apostrophes'),
        body('email')
          .notEmpty()
          .withMessage('The email field is required')
          .isEmail()
          .withMessage('Invalid email'),
        body('username')
          .notEmpty()
          .withMessage('Required! Please enter a username')
          .custom(async (value, { req }) => {
            const { usersCollection } = req.app.locals;
            const user = await usersCollection.findOne({ username: value });
            if (user) {
              throw new Error('Username already exists');
            }
          })
          .isLength({ min: 5, max: 20 })
          .withMessage('Username must be between 3 and 20 characters')
          .matches(usernamePattern)
          .withMessage('Username can only contain letters, numbers, and underscores'),
        body('password')
          .notEmpty()
          .withMessage('Password is requires')
          .isStrongPassword()
          .withMessage(
            'Please enter a strong password. It must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
          ),
        body('role').notEmpty().withMessage('The role field is required'),
        body('phoneNumber')
          .notEmpty()
          .withMessage('The phne number is required')
          .matches(phoneNumberPattern)
          .withMessage('Please enter a valid phone number'),
        body('address')
          .notEmpty()
          .withMessage('Address is required')
          .isLength({ min: 5, max: 150 })
          .withMessage('Address must be between 5 and 150 characters')
      ];
    }
  }
};
