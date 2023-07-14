const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    req.user = null;
    res.redirect('/login');
  });
});

module.exports = router;
