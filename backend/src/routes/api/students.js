const express = require('express');
const studentController = require('../../controllers/studentController');

const router = express();

router.route('/')
        .post(studentController.handleAssign)
        .get(studentController.getStudents);
        
router.route('/:id')
        .put(studentController.handleReturn)
        .get(studentController.getStudent);

router.route('/edit/:uuid')
        .put(studentController.updateStudent);

module.exports = router;