import React, { useState ,useEffect} from 'react';
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
    width: 400,
    height:480,
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
    height:150,
    bgcolor: 'background.paper',
    border: '2px solid #5D87FF',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
  },
};
const Home = () => {
    const [products, setProducts] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [openDelete, setOpenDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState('');
    const [idProject,setIdproject] = useState('');
    const [token, setToken] = useState('');
    const [dec, setDec] = useState('');
    const [img, setImg] = useState('');
    const [status,setStatus] = useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const handleSelectChange = (event) => {
      setStatus(event.target.value);
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
      setIdproject(e);
      setOpenDelete(true);
    }
  
    function afterOpenModalDelete() {
    }
  
    function closeModalDelete() {
      setOpenDelete(false);
    }
    const onSetvalue = (value) =>{
      setIsEdit(true)
      setIdproject(value._id)
      setDec(value.dec)
      setImg(value.img)
      setTitle(value.title)
      setStatus(value.status);
      openModal();
  }
    const resetState = () =>{
        setIsEdit(false)
        setTitle('')
        setDec('')
        setImg('')
        setIdproject('')
        setStatus(false);
    }
   const onCreate = async () => {
        if(title === '' || dec === '' || img === '' || status === null){
            toast.error("You need fill all information!");
        }else{
            try{
              if(isEdit){
                axios.put(`http://localhost:8000/user/update-project/?id=${idProject}`, {title,dec,img,status}, {headers: {
                  'Authorization': `Bearer ${token}`
                }})
                  .then(res => {
                      if(res.status === 200){
                        setProducts(products.map((post) => post._id === idProject ? res.data.product : post));
                        closeModal();
                        resetState();
                        toast.success(res.data.message);
                      }
                      }               
                  )
                  .catch(err => console.log(err))
              }else{
                axios.post('http://localhost:8000/user/add-project/', {title,dec,img}, {headers: {
                  'Authorization': `Bearer ${token}`
              }})
                  .then(res => {
                      if(res.status === 201){
                          products.push(res.data.product);
                          setProducts(products);
                          closeModal();
                          resetState();
                          toast.success(res.data.message);
                      }
                      }               
                  )
                  .catch(err => console.log(err))
              }
         
            } catch (error) {
                console.log('Error:', error.message);
            }
        }
       
   };
   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        setToken(token);
        const response = await axios('http://localhost:8000/user/get-projects/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
         setProducts(response.data);
         setIsLoading(false);
         console.log('response:', response);
      } catch (error) {
        console.log('Error:', error.message);
      }
    };

    fetchProducts();
  }, []);
   const findIndex = (id) => {
    var result = -1;
    products.forEach((value, index) => {
      if (value._id === id) {
        result = index;
      }
    });
    return result;
  };
 
  const onDelete = async (e) =>{
    try{
        const response = await axios(`http://localhost:8000/user/delete-projects/?id=${idProject}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 200){
            setProducts(products.filter((p) => p._id !== idProject))
            closeModalDelete();
            toast.success("Delete project successfully!");
              
        }
    } catch (error) {
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
        <button  onClick={closeModalDelete} class="btn btn-danger w-100 py-8 fs-4 mb-4 rounded-2">No</button> 
        </div>
        <div className='col-sm-6 col-xl-6'>
        <button  onClick={onDelete} class="btn btn-success w-100 py-8 fs-4 mb-4 rounded-2">Yes</button> 
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
       <div class="mb-3">
        <label for="exampleInputtext1" class="form-label">Title:</label>
        <input type="text" class="form-control" id="exampleInputtext1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Description:</label>
        <input type="text" class="form-control" id="exampleInputEmail1" value={dec} onChange={(e) => setDec(e.target.value)} placeholder="Description "/>
      </div>
      <div class="mb-4">
        <label for="exampleInputPassword1" class="form-label">Image:</label>
        <input type="text" class="form-control" id="exampleInputPassword1" value={img} onChange={(e) => setImg(e.target.value)} placeholder="Link image"/>
      </div>
        <div class="mb-3">
          <label for="disabledSelect" class="form-label">Status</label>
          <select id="disabledSelect" value={status} onChange={handleSelectChange} class="form-select">
            <option value={true}>Active</option>
             <option value={false}>UnActive</option>
          </select>
        </div>
      <button  onClick={onCreate} class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Submit</button> 
      </Modal>
    <Menu/>
    <div className="body-wrapper">
    <Header/>
      <div className="container-fluid">
        {isLoading ? <div   style={{
        width: '100%',
        height: 700,
        display: 'flex',
        justifyContent: 'center', // Canh giữa theo chiều ngang
        alignItems: 'center' // Canh giữa theo chiều dọc
      }}><Loading/></div>  : <> <button type="button" onClick={openModal} class="btn btn-primary m-1">New Project</button>
        <div className="row">
            {products.length === 0 ? <div  style={{
        width: '100%',
        height: 700,
        display: 'flex',
        justifyContent: 'center', // Canh giữa theo chiều ngang
        alignItems: 'center' // Canh giữa theo chiều dọc
      }}><p>Empty list</p></div>  :products?.map(value=>(
            <div className="col-sm-6 col-xl-3">
                <div className="card overflow-hidden rounded-2">
                <div className="position-relative">
                    <a href="javascript:void(0)">
                    <img
                        src={value.img}
                        className="card-img-top rounded-0"
                        alt="..."
                    />
                    </a>
                    <div className="icons-container" style={{ position: 'absolute', top: 10, right: 10 }}>
                        <FaEdit  className="edit-icon" onClick={()=>onSetvalue(value)} style={{ marginRight: '10px' ,color: '#5D87FF',fontSize:20}} />
                        <FaTrash onClick={()=>openModalDelete(value._id)} className="delete-icon" style={{ color: '#5D87FF' ,fontSize:20}} />
                    </div>
               
                </div>
                <div className="card-body pt-3 p-4">
                    <h6 className="fw-semibold fs-4">{value.title}</h6>
                    <div className="d-flex align-items-center justify-content-between">
                     <p>{value.dec}</p>
                    </div>
                    {value.status ? <p style={{fontWeight:'bold',color:'green'}}>Active</p>: <p style={{fontWeight:'bold',color:'red'}}>UnActive</p>} 
                </div>             
                </div>
            </div>
                ))}
            
            </div></> }
       
        <Footer/>
      </div>
    </div>
  </div>
  );
};

export default Home;
