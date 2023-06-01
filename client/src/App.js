import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm.js'
import { BrowserRouter, Route, Switch ,Redirect} from 'react-router-dom';
import RegisterForm from './components/RegisterForm.js'
import Home from './pages/index.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
   <BrowserRouter>
   <ToastContainer/>
      <Switch>
        <Route path="/" exact component={LoginForm} />
        <Route path="/register" component={RegisterForm} />
        <PrivateRoute path="/home" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}
const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={(props) => isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )}
    />
  );
};
export default App;
