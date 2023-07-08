const { body } = require('express-validator');

exports.validateRoutes = (entity) => {
  switch (entity) {
    case 'projectsRoute': {
      return [
        body('title')
          .notEmpty()
          .withMessage('The title field is required')
          .isLength({ max: 100 })
          .withMessage('The title must be at most 100 characters long'),

        body('description')
          .notEmpty()
          .withMessage('The description field is required')
          .isLength({ max: 1000 })
          .withMessage('The description must be at most 1000 characters long'),

        body('manager')
          .notEmpty()
          .withMessage('The manager field is required')
          .isString()
          .withMessage('The manager must be a string'),

        body('status')
          .notEmpty()
          .withMessage('The status field is required')
          .isString()
          .withMessage('The status must be a string'),

        body('startDate')
          .notEmpty()
          .withMessage('The startDate field is required')
          .isISO8601()
          .withMessage('Invalid date format. Must be in ISO 8601 format'),

        body('dueDate')
          .notEmpty()
          .withMessage('The dueDate field is required')
          .isISO8601()
          .withMessage('Invalid date format. The date format must be in ISO 8601 format'),

        body('teamMembers')
          .notEmpty()
          .withMessage('The teamMembers field is required')
          .isArray({ min: 1 })
          .withMessage('The teamMembers must be an array with at least one member'),

        body('tasks')
          .notEmpty()
          .withMessage('The tasks field is required')
          .isArray({ min: 1 })
          .withMessage('The tasks must be an array with at least one task'),

        body('progress')
          .notEmpty()
          .withMessage('The progress field is required')
          .isString()
          .withMessage('The progress must be a string')
      ];
    }
    case 'createComment': {
      return [
        body('taskId')
          .notEmpty()
          .withMessage('The taskId field is required')
          .isString()
          .withMessage('The taskId must be a string'),

        body('userId')
          .notEmpty()
          .withMessage('The userId field is required')
          .isString()
          .withMessage('The userId must be a string'),

        body('text')
          .notEmpty()
          .withMessage('The text field is required')
          .isString()
          .withMessage('The text must be a string'),

        body('likes')
          .notEmpty()
          .withMessage('The likes field is required')
          .isInt({ min: 0 })
          .withMessage('The likes must be a non-negative integer'),

        body('replies').optional().isArray().withMessage('The replies field must be an array'),

        body('tags').optional().isArray().withMessage('The tags field must be an array')
      ];
    }
    case 'updateComment': {
      return [
        body('text')
          .notEmpty()
          .withMessage('The text field is required')
          .isString()
          .withMessage('The text must be a string'),
        body('tags').optional().isArray().withMessage('The tags field must be an array')
      ];
    }
  }
};
