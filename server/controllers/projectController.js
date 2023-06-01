const Project = require('../models/projectModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Thêm sản phẩm mới
async function add(req, res) {
  try {
    console.log("s",req.user)
    const { title, dec, img } = req.body;
      const { username} = req.user;


    // Tạo sản phẩm mới
    const product = new Project({ title, dec, img ,username});
    await product.save();

    res.status(201).json({ message: 'Project created successfully', product });
  } catch (error) {
     console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy danh sách sản phẩm
async function get(req, res){
  try {
     const { username} = req.user;
    // Lấy tất cả sản phẩm từ cơ sở dữ liệu
    const products = await Project.find({username});

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function getById(req, res) {
  try {
    console.log(req);
    const productId = req.query.id;

    // Tìm sản phẩm theo ID
    const product = await Project.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function update(req, res){
  try {
    const productId = req.query.id;
    const { title, dec, img } = req.body;

    // Tìm sản phẩm theo ID và cập nhật thông tin
    const updatedProduct = await Project.findByIdAndUpdate(productId, { title, dec, img }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function remove(req, res){
  try {
    const projectId = req.query.id;
   // Tìm sản phẩm theo ID và xoá
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
    return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.add = add;
module.exports.get = get;
module.exports.getById = getById;
module.exports.update = update;
module.exports.remove = remove;
