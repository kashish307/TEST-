import React from 'react';
import { BrowserRouter as Router , Route , Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

const App = () =>
 {
  return (
    <>
    <Header />
    <Container>
      <main className='py-4'>
      <Router>
      <Routes>
      <Route path='/order/:id' element={<OrderScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/login/shipping' element={<ShippingScreen />} />
      <Route path='/payment' element={<PaymentScreen />} />
      <Route path='/placeorder' element={<PlaceOrderScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart/:id/:qty' element={<CartScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/' element={<HomeScreen />} />
    </Routes>
      </Router>
      </main>
    </Container>
      <Footer />
      </>

  );
}

export default App;
