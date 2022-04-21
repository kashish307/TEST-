import React from "react";
import {useDispatch, useSelector, usSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { logout } from '../actions/userActions'

const Header = () => {

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin
  const dispatch =  useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">BookZone</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/cart">
                <i className="fas fa-shopping-cart"></i>Cart
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  
                    <NavDropdown.Item href='/profile'>
                      Profile
                    </NavDropdown.Item>
                   
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : <Nav.Link href="/login">
              <i className="fas fa-user"></i>Sign In
            </Nav.Link> }
              <Nav.Link href="https://docs.google.com/forms/d/e/1FAIpQLSflXMeyKP2OzHjEySo4aU3x5Tu3LkzF3u7RG0LQOB5ZIhZAIw/viewform">
                <i className="fas fa-bell"></i>Sell Your Book
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;