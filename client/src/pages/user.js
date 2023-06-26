import React, { useState, useEffect } from 'react';
import Header from '../layouts/header.js';
import Footer from '../layouts/footer.js';
import Menu from "../layouts/menu.js";
import axios from 'axios';
import Loading from "../components/Loading.js";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from 'react-modal';
import Fade from '@mui/material/Fade';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 650,
        bgcolor: 'background.paper',
        border: '2px solid #5D87FF',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    },
};
const customStylesDelete = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 150,
        bgcolor: 'background.paper',
        border: '2px solid #5D87FF',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    },
};
const Home = () => {
    const [users, serUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openDelete, setOpenDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [username, setUsername] = useState('');
    const [idUser, setIdUser] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const handleSelectChange = (event) => {

    };

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        resetState();
        setIsOpen(false);
    }
    ///delete 
    function openModalDelete(e) {
        setIdUser(e);
        setOpenDelete(true);
    }

    function afterOpenModalDelete() {
    }

    function closeModalDelete() {
        setOpenDelete(false);
    }
    const onSetvalue = (value) => {
        setIsEdit(true)
        setIdUser(value._id)
        setAddress(value.address)
        setEmail(value.email)
        setFullName(value.fullName)
        setUsername(value.username);
        setPassword(value.password);
        setPhoneNumber(value.phoneNumber);
        openModal();
    }
    const resetState = () => {
        setIsEdit(false)
        setAddress('')
        setEmail('')
        setFullName('')
        setUsername('')
        setIdUser('')
        setPassword('')
        setPhoneNumber('');
    }
    const onCreate = async () => {
        if (email === '' || username === '' || fullName === '' || address === '' || password === '' || phoneNumber === '')
        {
            toast.error("You need fill all information!");
        } else
        {
            try
            {
                if (isEdit)
                {
                    axios.put(`http://localhost:8000/user/update-user/?id=${idUser}`, { fullName, address, phoneNumber }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            if (res.status === 200)
                            {
                                serUsers(users.map((post) => post._id === idUser ? res.data.user : post));
                                closeModal();
                                resetState();
                                toast.success(res.data.message);
                            }
                        }
                        )
                        .catch(err => console.log(err))
                } else
                {
                    axios.post('http://localhost:8000/user/add-user/', { username, password, email, fullName, address, phoneNumber }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            if (res.status === 201)
                            {
                                users.push(res.data.user);
                                serUsers(users);
                                closeModal();
                                resetState();
                                toast.success(res.data.message);
                            }
                        }
                        )
                        .catch(err => console.log(err))
                }

            } catch (error)
            {
                console.log('Error:', error.message);
            }
        }

    };
    useEffect(() => {
        const fetchProducts = async () => {
            try
            {
                const token = localStorage.getItem('token');
                setToken(token);
                const response = await axios('http://localhost:8000/user/get-user/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                serUsers(response.data);
                setIsLoading(false);
                console.log('response:', response);
            } catch (error)
            {
                console.log('Error:', error.message);
            }
        };

        fetchProducts();
    }, []);
    const findIndex = (id) => {
        var result = -1;
        users.forEach((value, index) => {
            if (value._id === id)
            {
                result = index;
            }
        });
        return result;
    };

    const onDelete = async (e) => {
        try
        {
            const response = await axios(`http://localhost:8000/user/delete-user/?id=${idUser}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200)
            {
                serUsers(users.filter((p) => p._id !== idUser))
                closeModalDelete();
                toast.success("Delete user successfully!");

            }
        } catch (error)
        {
            console.log('Error:', error.message);
        }
    }
    return (
        <div
            className="page-wrapper"
            id="main-wrapper"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
        >
            <Modal
                isOpen={openDelete}
                onAfterOpen={afterOpenModalDelete}
                onRequestClose={closeModalDelete}
                style={customStylesDelete}
            >
                <h4>Are you sure you want to delete?</h4>
                <div className='row'>
                    <div className='col-sm-6 col-xl-6'>
                        <button onClick={closeModalDelete} class="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2">No</button>
                    </div>
                    <div className='col-sm-6 col-xl-6'>
                        <button onClick={onDelete} class="btn btn-success w-100 py-8 fs-4 mb-4 rounded-2">Yes</button>
                    </div>
                </div>

            </Modal>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {isEdit ? <div class="mb-3">
                    <label for="exampleInputtext1" class="form-label">Email:</label>
                    <input type="text" class="form-control" id="exampleInputtext1" value={email} disabled onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div> : <div class="mb-3">
                    <label for="exampleInputtext1" class="form-label">Email:</label>
                    <input type="text" class="form-control" id="exampleInputtext1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </div>}
                {isEdit ? <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">UserName:</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" value={username} disabled onChange={(e) => setUsername(e.target.value)} placeholder="Username " />
                </div> : <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">UserName:</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username " />
                </div>}

                <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">FullName:</label>
                    <input type="text" class="form-control" id="exampleInputPassword1" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="FullName" />
                </div>
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Address:</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address " />
                </div>
                <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Phone Number:</label>
                    <input type="text" class="form-control" id="exampleInputPassword1" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="PhoneNumber" />
                </div>
                {isEdit ? null : <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Password:</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </div>}

                <button onClick={onCreate} class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Submit</button>
            </Modal>
            <Menu />
            <div className="body-wrapper">
                <Header />
                <div className="container-fluid">

                    {isLoading ? <div style={{
                        width: '100%',
                        height: 700,
                        display: 'flex',
                        justifyContent: 'center', // Canh giữa theo chiều ngang
                        alignItems: 'center' // Canh giữa theo chiều dọc
                    }}><Loading /></div> : <> <button type="button" onClick={openModal} class="btn btn-primary m-1">New User</button>
                        <div className="row">
                            {users.length === 0 ? <div style={{
                                width: '100%',
                                height: 700,
                                display: 'flex',
                                justifyContent: 'center', // Canh giữa theo chiều ngang
                                alignItems: 'center' // Canh giữa theo chiều dọc
                            }}><p>Empty list</p></div> : <div class="col-lg-12 d-flex align-items-stretch">
                                <div class="card w-100">
                                    <div class="card-body p-4">
                                        <div class="table-responsive">
                                            <table class="table text-nowrap mb-0 align-middle">
                                                <thead class="text-dark fs-4">
                                                    <tr>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">STT</h6>
                                                        </th>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">User Name</h6>
                                                        </th>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">Full Name</h6>
                                                        </th>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">Email</h6>
                                                        </th>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">Address</h6>
                                                        </th>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">Phone Number</h6>
                                                        </th>
                                                        <th class="border-bottom-0">
                                                            <h6 class="fw-semibold mb-0">Hoạt động</h6>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users?.map(value => (
                                                        <tr>
                                                            <td class="border-bottom-0"><h6 class="fw-semibold mb-0">1</h6></td>
                                                            <td class="border-bottom-0">
                                                                {/* <h6 class="fw-semibold mb-1">Sunil Joshi</h6> */}
                                                                <span class="fw-normal">{value.username}</span>
                                                            </td>
                                                            <td class="border-bottom-0">
                                                                <p class="mb-0 fw-normal">{value.fullName}</p>
                                                            </td>
                                                            <td class="border-bottom-0">
                                                                <p class="mb-0 fw-normal">{value.email}</p>
                                                            </td>
                                                            <td class="border-bottom-0">
                                                                <p class="mb-0 fw-normal">{value.address}</p>
                                                            </td>
                                                            <td class="border-bottom-0">
                                                                <p class="mb-0 fw-normal">{value.phoneNumber}</p>
                                                            </td>
                                                            <td class="border-bottom-0">
                                                                <FaEdit className="edit-icon" onClick={() => onSetvalue(value)} style={{ marginRight: '10px', color: '#5D87FF', fontSize: 20 }} />
                                                                <FaTrash onClick={() => openModalDelete(value._id)} className="delete-icon" style={{ color: '#5D87FF', fontSize: 20 }} />
                                                            </td>

                                                        </tr>
                                                    ))}


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                        </div></>}

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Home;
