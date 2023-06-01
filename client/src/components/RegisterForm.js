import React, { useState,useEffect } from 'react';
import { useHistory ,Link} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Kiểm tra xem đã có token trong localStorage hay chưa
    const token = localStorage.getItem('token');
    console.log(token)
    // Nếu có token, chuyển hướng đến trang sản phẩm
    if (token) {
      history.push('/home');
    }
  }, []);
  const handleRegister = async () => {
     try {
          if(username === '' || password === '' || email === ''){
            toast.error("You need fill all information!");
        }else{
            axios.post('http://localhost:8000/user/register/', {
                username: username,
                password: password,
                email:email
            })
            .then(function (response) {
                console.log(response);
                if (response.status === 201) {
                    console.log(response);
                    // Chuyển hướng đến trang sản phẩm
                    history.push('/');
                    toast.success("Register successfully!!!");
                }else if(response.status === 200) {
                    toast.error(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });  
        }
       
    } catch (error) {
      console.log('Error:', error.message);
    }
  };
  return (
   <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
       
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3">
            <div class="card mb-0">
              <div class="card-body">
                <a href="./index.html" class="text-nowrap logo-img text-center d-block py-3 w-100">
                  <img src="../assets/images/logos/dark-logo.svg" width="180" alt="" />
                </a>
                <div>
                  <div class="mb-3">
                    <label for="exampleInputtext1" class="form-label">Username</label>
                    <input type="text" class="form-control" id="exampleInputtext1" value={username} onChange={(e) => setUsername(e.target.value)} aria-describedby="textHelp" />
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" />
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}/>
                  </div>
                  <button onClick={()=>handleRegister()} class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Sign Up</button>
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="fs-4 mb-0 fw-bold">Already have an Account?</p>
                    <Link class="text-primary fw-bold ms-2" to="/">Sign In</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RegisterForm;
