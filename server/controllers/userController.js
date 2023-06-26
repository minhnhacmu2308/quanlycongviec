const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
async function register(req, res) {
  try
  {
    const { username, password, email } = req.body;
    console.log(username);
    console.log(password);

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser || existingEmail)
    {
      return res.status(200).json({ message: 'User already exists' });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ username, password: hashedPassword, email: email });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error)
  {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
}
// Đăng nhập và tạo JWT
async function login(req, res) {
  try
  {
    const { username, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ username });
    if (!user)
    {
      return res.status(200).json({ status: "Error", message: 'Invalid username or password' });
    }

    // So sánh mật khẩu đã mã hóa với mật khẩu nhập vào
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
    {
      return res.status(200).json({ status: "Error", message: 'Invalid username or password' });
    }

    // Tạo JWT với mã thông tin người dùng
    const token = jwt.sign({ username: user.username }, 'secret_key');

    res.status(200).json({ status: "Success", token });
  } catch (error)
  {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Thêm sản phẩm mới
async function addUser(req, res) {
  try
  {
    const { username, password, email, fullName, address, phoneNumber } = req.body;
    let role = "user";

    // Tạo sản phẩm mới
    const user = new User({ username, password, email, fullName, address, phoneNumber, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error)
  {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy danh sách sản phẩm
async function getUser(req, res) {
  try
  {
    // Lấy tất cả sản phẩm từ cơ sở dữ liệu
    const users = await User.find({ role: "user" });

    res.status(200).json(users);
  } catch (error)
  {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function getUserById(req, res) {
  try
  {
    console.log(req);
    const userId = req.query.id;

    // Tìm sản phẩm theo ID
    const user = await User.findById(userId);

    if (!user)
    {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(user);
  } catch (error)
  {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function updateUser(req, res) {
  try
  {
    const userId = req.query.id;
    const { password, fullName, address, phoneNumber } = req.body;

    // Tìm sản phẩm theo ID và cập nhật thông tin
    const updatedUser = await User.findByIdAndUpdate(userId, { fullName, address, phoneNumber }, { new: true });

    if (!updatedUser)
    {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error)
  {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function removeUser(req, res) {
  try
  {
    const userId = req.query.id;
    // Tìm sản phẩm theo ID và xoá
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser)
    {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error)
  {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.addUser = addUser;
module.exports.getUser = getUser;
module.exports.getUserById = getUserById;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.login = login;
module.exports.register = register;