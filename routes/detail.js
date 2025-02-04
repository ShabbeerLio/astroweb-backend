const express = require('express');
const router = express.Router();
const Detail = require('../models/Detail');
var fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// route1 : Get all category using GET: "/api/detail/fetchalldetail" login required
router.get('/fetchalldetail', fetchuser, async (req, res) => {
    try {
        const clients = await Detail.find({ user: req.user.id });
        res.json(clients);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// route2 : Add new category using POST: "/api/detail/adddetail" login required
router.post('/adddetail', fetchuser, [
    body('detail', 'Add your detail').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { detail } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const Category = new Detail({
            detail,
            user: req.user.id
        });
        const savedDetail = await Category.save();
        res.json(savedDetail);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;