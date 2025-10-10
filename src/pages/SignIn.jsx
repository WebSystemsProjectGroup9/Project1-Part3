import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { LogIn, UserPlus, Eye, LogOut } from "lucide-react";
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext'; 
import loginImage from "../assets/Login.png"

function SignIn() {
  const { theme, toggleTheme } = useTheme();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [showLogout, setShowLogoutBtn] = useState(false);
  
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });

  const [showRegisterPanel, setShowRegisterPanel] = useState(false);
  const toast = useToast();

  const signOutUser = () => {
    setShowLogoutBtn(false);
    toast.info("Logout successful!");
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if(loginData.username == registerData.username && loginData.password == registerData.password) {
      toast.success("Login successful!");
      setShowLogoutBtn(true);
    }
    else {
      setShowLogoutBtn(false);
      toast.error("Incorrect username or password!");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.username.trim() || !registerData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!emailRegex.test(registerData.email)) {
      toast.error("Email is not valid");
      return;
    }

    if (!/[A-Z]/.test(registerData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(registerData.password)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    if (!/\d/.test(registerData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(registerData.password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }


    setLoginData({
      username: registerData.username,
      password: registerData.password
    });
    
    setShowRegisterPanel(false);
    toast.success("Account created successfully!");

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister(e);
    }
    
  };

  const registerUser = (showRegisterPanel) => {
    setShowRegisterPanel(showRegisterPanel);
    setRegisterData({ name: "", email: "", username: "", password: "" });
    setLoginData({
      username: "",
      password: ""
    });
    setShowLogoutBtn(false);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={theme === 'light' ? 'min-vh-100 py-5 position-relative overflow-hidden bg-white text-dark' : 'min-vh-100 py-5 position-relative overflow-hidden dark-bg text-white'}>
      <Container className="py-5" style={{ maxWidth: '500px' }}>        
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <img src={loginImage} className="login-image"></img>
          </div>
          <h1 className="d-flex align-items-center justify-content-center fw-bold mb-2 text-white">
            <div className={theme === 'light' ? 'text-dark add-margin-right' : 'text-white add-margin-right'}>Welcome to </div> <span className="text-primary">PhishLens</span>
          </h1>
          <p className={theme === 'light' ? 'text-dark' : 'text-light'}>
            Sign in to access your deepfake detection dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg bg-secondary bg-opacity-25 border-secondary">
          <Card.Body className="p-4">
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className={theme === 'light' ? 'text-dark' : 'text-white'}>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className={theme === 'light' ? 'bg-white text-dark border-white' : 'bg-dark text-white border-secondary'}
                  placeholder="Enter your username"
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className={theme === 'light' ? 'text-dark' : 'text-white'}>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className={theme === 'light' ? 'bg-white text-dark border-white' : 'bg-dark text-white border-secondary'}
                  placeholder="Enter your password"
                />
              </Form.Group>
              {!showLogout &&
              <Button type="submit" variant="primary" size="lg" className="w-100">
               <LogIn className="me-2" size={20} />Sign In
              </Button>}
            </Form>
            {showLogout && <Button onClick={signOutUser} variant="primary" size="lg" className="w-100">
               <LogOut className="me-2" size={20}  />Sign Out
              </Button> }
            <div className="mt-4 text-center">
              <p className={theme === 'light' ? 'text-dark mb-3' : 'text-light mb-3'}>Don't have an account?</p>
              <Button
                onClick={() => registerUser(true)}
                variant="outline-primary"
                className="w-100"
              >
                <UserPlus className="me-2" size={20} />
                Create Account
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Register Side Panel using Offcanvas */}
      <Offcanvas 
        show={showRegisterPanel} 
        onHide={() => setShowRegisterPanel(false)}
        placement="end"
        backdrop={true}
        scroll={false}
        className={theme === 'light' ? 'canvas light' : 'canvas dark'}
      >
        <Offcanvas.Header closeButton className={theme === 'light' ? 'navbar-light-color bg-opacity-25 box-shadow text-dark' : 'canvas dark text-white border-bottom'}>
          <Offcanvas.Title className={theme === 'light' ? 'fw-bold text-dark' : 'fw-bold text-white'}>Create Account</Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className={theme === 'light' ? 'bg-white text-dark' : 'bg-dark text-white'}>
          {/* Register Form */}
          <Form onSubmit={handleRegister} onKeyPress={handleKeyPress}>
            <Form.Group className="mb-3">
              <Form.Label className={theme === 'light' ? 'text-dark' : 'text-white'}>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className={theme === 'light' ? 'bg-white text-dark border-secondary' : 'bg-dark text-white border-secondary'}
                placeholder="Your full name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className={theme === 'light' ? 'text-dark' : 'text-white'}>Email</Form.Label>
              <Form.Control
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className={theme === 'light' ? 'bg-white text-dark border-secondary' : 'bg-dark text-white border-secondary'}
                placeholder="your.email@company.com"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className={theme === 'light' ? 'text-dark' : 'text-white'}>Username</Form.Label>
              <Form.Control
                type="text"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className={theme === 'light' ? 'bg-white text-dark border-secondary' : 'bg-dark text-white border-secondary'}
                placeholder="Choose a username"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className={theme === 'light' ? 'text-dark' : 'text-white'}>Password</Form.Label>
              <Form.Control
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className={theme === 'light' ? 'bg-white text-dark border-secondary' : 'bg-dark text-white border-secondary'}
                placeholder="Create a secure password"
              />
            </Form.Group>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100"
            >
              <UserPlus className="me-2" size={20} />
              Create Account
            </Button>
          </Form>
          
          <p className="text-light small mt-4 text-center">
            Press Enter or click the button to create your account
          </p>
        </Offcanvas.Body>
      </Offcanvas>
      <footer className="footer">
          <div className="footer-left">&copy;2025 PhishLens</div>
          <div className="scroll-top btn-primary" id="scrollTopBtn" onClick={scrollToTop}>↑ Top</div>
      </footer>
    </div>
  );
}

export default SignIn;