import React, { useState ,useEffect} from 'react';
import Header from '../layouts/header.js';
import Footer from '../layouts/footer.js';
import Menu from "../layouts/menu.js";
import axios from 'axios';
import Loading from "../components/Loading.js";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [title, setTitle] = useState('');
    const [idProject,setIdproject] = useState('');
    const [token, setToken] = useState('');
    const [dec, setDec] = useState('');
    const [img, setImg] = useState('');
    const handleOpen = () => {setOpen(true);setOpenDelete(false);};
    const handleClose = () => setOpen(false);
    const handleOpenDelete = (id) => {
        setIdproject(id);
        setOpenDelete(true);
        setOpen(true);
        console.log(idProject)
    }
    const handleCloseDelete = () => {setOpen(false)};
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #ffff',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };
    const resetState = () =>{
        setTitle('')
        setDec('')
        setImg('')
    }
   const onCreate = async () => {
        if(title === '' || dec === '' || img === ''){
            toast.error("You need fill all information!");
        }else{
            try{
            axios.post('http://localhost:8000/user/add-project/', {title,dec,img}, {headers: {
                'Authorization': `Bearer ${token}`
            }})
                .then(res => {
                    if(res.status === 201){
                        products.push(res.data.product);
                        setProducts(products);
                        handleClose();
                        resetState();
                        toast.success(res.data.message);
                    }
                    }               
                )
                .catch(err => console.log(err))
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
        const response = await axios(`http://localhost:8000/user/delete-projects/?id=${e}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.status === 200){
            setProducts(products.filter((p) => p._id !== e))
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
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
               <div>
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
                  <button  onClick={onCreate} class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Create</button>
                </div>    
          </Box>
        </Fade>
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
      }}><Loading/></div>  : <> <button type="button" onClick={handleOpen} class="btn btn-primary m-1">New Project</button>
        <div className="row">
            {products?.map(value=>(
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
                        <FaEdit  className="edit-icon" style={{ marginRight: '10px' ,color: 'white' }} />
                        <FaTrash onClick={()=>onDelete(value._id)} className="delete-icon" style={{ color: 'white' }} />
                    </div>
               
                </div>
                <div className="card-body pt-3 p-4">
                    <h6 className="fw-semibold fs-4">{value.title}</h6>
                    <div className="d-flex align-items-center justify-content-between">
                     <p>{value.dec}</p>
                    </div>
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
