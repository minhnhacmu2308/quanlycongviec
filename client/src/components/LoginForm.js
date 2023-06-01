import React, { useState ,useEffect} from 'react';
import { useHistory ,Link} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e) => {
    try {
        if(username === '' || password === ''){
            toast.error("You need fill all information!");
        }else{
             axios.post('http://localhost:8000/user/login/', {
             username: username,
             password: password
        })
        .then(function (response) {
           
            if (response.status === 200 ) {
                if(response.data.status === 'Success'){
                    // Lưu token vào localStorage
                    localStorage.setItem('token', response.data.token);

                    // Chuyển hướng đến trang sản phẩm
                    history.push('/home');
                    toast.success("Login successfully!");
                }else{
                    toast.error(response.data.message);
                }
               
            }else{
                toast.error("Username or password invalid!");
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
                    <label for="exampleInputEmail1" class="form-label">Username</label>
                    <input type="text" class="form-control" value={username} onChange={(e) => setUsername(e.target.value)} id="exampleInputEmail1" aria-describedby="username" />
                  </div>
                  <div class="mb-4">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input type="password" class="form-control" value={password} onChange={(e) => setPassword(e.target.value)}  id="exampleInputPassword1"/>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <div class="form-check">
                      <input class="form-check-input primary" type="checkbox" value="" id="flexCheckChecked" checked />
                      <label class="form-check-label text-dark" for="flexCheckChecked">
                        Remeber this Device
                      </label>
                    </div>
                    <a class="text-primary fw-bold" href="./index.html">Forgot Password ?</a>
                  </div>
                  <button onClick={(e)=>handleLogin(e)} class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Sign In</button>
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="fs-4 mb-0 fw-bold">New to Modernize?</p>
                    <Link class="text-primary fw-bold ms-2" to="/register">Create an account</Link>
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

export default LoginForm;
