import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = ({}) => {
  const {id} = useParams() //useParams can't be used in useEffect
  const {qty} = useParams()
  const productId = id
  //const qty = location.search ? Number(location.search.split('=')[1]) : 1
  const navigate= useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)  //used to fetch items in redux and useDispatch is used to execute
  const { cartItems } = cart

  useEffect(() => {
    console.log(`cartPage ${id} :${qty}`)
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

    const checkoutHandler = () => {
      navigate('/login?redirect=shipping')
      // if logged in then it will be redirected to shipping
    }
  return (
    <Row>
     <Col md={8}>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? ( //error if cart is empty
        <Message> 
          Your Cart is empty <Link to='/'>Go Back</Link>
        </Message>
      ) : (
        <ListGroup variant="flush">
          {cartItems.map(item => (
            <ListGroup.Item key={item.product}>
              <Row>
                <Col md={2}> 
                  <Image src={item.image} alt={item.name} fluid rounded />  
                </Col>
                <Col md={3}>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </Col>
                <Col md={2}>Rs{item.price}</Col>
                <Col md={2}>
                <Form.Control
                  as= 'select'
                  value = {item.qty}
                  onChange ={(e) => dispatch(addToCart(item.product,
                    Number(e.target.value)))}
                  >
                   { [...Array(item.countInStock).keys()].map(x => (
                      <option key ={x + 1} value ={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button type='button' variant='light' onClick= {() =>
                    removeFromCartHandler(item.product)
                  }>
                    <i className='fas fa-trash'></i>
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup> //flush is used to remove extra space
      )
    }
     </Col>
     {/* to calculate total items */}
     <Col md={4}> 
     {/* medium devices */}
       <Card>          
         <ListGroup variant='flush'>
           <ListGroup.Item>
             <h2>
               Subtotal({cartItems.reduce((acc , item) => acc + item.qty, 0)})
               items
               {/*reduce is used to add  */}
             </h2>
               Rs{cartItems.reduce((acc , item) => acc + item.qty * item.price , 0).toFixed(2)}
               { /* toFixed= to get the price upto 2 decimal places */}
            
           </ListGroup.Item>
           <ListGroup.Item>
             <Button type = 'button' className='btn-block' disabled = {cartItems.length === 0} onClick={checkoutHandler}>
                 Proceed To Checkout
             </Button>
           </ListGroup.Item>
         </ListGroup>
       </Card>
     </Col>
    </Row>
)}

export default CartScreen