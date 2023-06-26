const express = require('express');
const router = express.Router();
const { register, login, addUser, getUser, getUserById, removeUser, updateUser } = require("../controllers/userController.js");
const { add, get, getById, remove, update } = require("../controllers/projectController.js");
const { authenticateToken } = require("../middlewares/index.js");
// Đăng ký người dùng mới
router.post('/register', register);
router.post('/login', login);
router.post('/add-user', authenticateToken, addUser);
router.get('/get-user', authenticateToken, getUser);
router.put('/update-user', authenticateToken, updateUser);
router.get('/delete-user', authenticateToken, removeUser);
router.get('/get-user-by-id', authenticateToken, getUserById);
router.post('/add-project', authenticateToken, add);
router.get('/get-projects', authenticateToken, get);
router.put('/update-project', authenticateToken, update);
router.get('/delete-projects', authenticateToken, remove);
router.get('/get-project-by-id', authenticateToken, getById);

module.exports = router;
