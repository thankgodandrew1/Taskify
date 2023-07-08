const { body } = require('express-validator');
const phoneNumberPattern = /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
const usernamePattern = /^[a-zA-Z0-9_]+$/;

exports.validateRoutes = (entity) => {
  switch (entity) {
    // Code case Taskify users and tasks POST and PUT routers validation!
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
          .optional()
          .custom(async (value, { req }) => {
            const { usersCollection } = req.app.locals;
            const user = await usersCollection.findOne({ username: value });
            if (user && user._id.toString() !== req.params.userId) {
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

    case 'taskRoutes': {
      return [
        body('title')
          .notEmpty()
          .withMessage('The title field is required')
          .isLength({ max: 100 })
          .withMessage('The title must be at most 100 characters long'),

        body('description')
          .notEmpty()
          .withMessage('The description field is required')
          .isLength({ max: 500 })
          .withMessage('The description must be at most 500 characters long'),

        body('assignee')
          .notEmpty()
          .withMessage('The assignee field is required')
          .isLength({ max: 50 })
          .withMessage('The assignee name must be at most 50 characters long'),

        body('status')
          .notEmpty()
          .withMessage('The status field is required')
          .isIn(['in_progress', 'completed', 'pending'])
          .withMessage('Invalid status. Must be one of: in_progress, completed, pending'),

        body('priority')
          .notEmpty()
          .withMessage('The priority field is required')
          .isIn(['low', 'medium', 'high'])
          .withMessage('Invalid priority. Must be one of: low, medium, high'),

        body('dueDate')
          .notEmpty()
          .withMessage('The dueDate field is required')
          .isISO8601()
          .withMessage(
            'Invalid date format. Must be in ISO 8601 format, e.g., "2023-07-01T12:00:00Z"'
          ),

        body('attachments').optional().isArray().withMessage('Attachments must be an array'),

        body('tags').optional().isArray().withMessage('Tags must be an array')
      ];
    }
  }
};
