const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
async function register(req, res) {
  try {
    const { username, password ,email} = req.body;
    console.log(username);
    console.log(password);

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ username, password: hashedPassword ,email:email});
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
}
// Đăng nhập và tạo JWT
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // So sánh mật khẩu đã mã hóa với mật khẩu nhập vào
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Tạo JWT với mã thông tin người dùng
    const token = jwt.sign({ username: user.username }, 'secret_key');

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports.login = login;
module.exports.register = register;