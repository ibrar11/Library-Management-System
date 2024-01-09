const express = require('express');
const bookController = require('../../controllers/bookController');

const router = express();

router.route('/')
      .get(bookController.getBooks)
      .post(bookController.addBook);

router.route('/:id')
      .put(bookController.updateBook)
      .delete(bookController.deleteBook)

module.exports = router;