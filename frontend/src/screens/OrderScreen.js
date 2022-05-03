import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Button, Row, ListGroup, Col, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deliverOrder, getOrderDetails, payOrder } from '../actions/orderActions'
import axios from 'axios'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { id } = useParams()
  const orderId = id

   //const [sdkReady, setSdkReady] = useState(false)

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo } = userLogin

  if (!loading) {
    //calculating prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    )

    order.shippingPrice = addDecimals(order.itemsPrice > 300 ? 0 : 40)

    order.taxPrice = addDecimals(Number((0.15 * order.itemsPrice).toFixed(2)))

    order.totalPrice = (
      Number(order.itemsPrice) +
      Number(order.shippingPrice) +
      Number(order.taxPrice)
    ).toFixed(2)
    console.log(order.totalPrice);
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  async function displayRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }
    // creating a new order
    // const price = {
    //   price: order.totalPrice
    // }
    
    const price = Number(order.totalPrice)
    //console.log(price)
    
    const result = await axios
      .post(`http://localhost:5000/api/payment/api/orders`, {price})
      .catch((err) => {
        alert('Server error. Are you online?')
      })

      

    // if (!result) {
    //   alert('Server error. Are you online?')
    //   return
    // }
    // console.log('Helu')
    // Getting the order details back

    //console.log("result");

    const { amount,
      id: order_id,
      currency 
    } = result.data
    
    const options = {
      key: 'rzp_test_lL7NK1WWagxn4W', // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: order.user.name,
      description: 'Transaction',
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        }
        const result = await axios
          .post('http://localhost:5000/api/payment/api/success', data)
          .catch((err) => {
            alert('Server error. Are you online?')
          })
          if(result.data.msg=="success"){
            const orderDetails = await axios
            .put(`http://localhost:5000/api/orders/pay/${orderId}`,order)
            .catch((err)=>{
              console.log(err);
            })
            console.log(orderDetails);
            order = orderDetails.data;
          }
        // alert(result.data.msg)
      },
     }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  
  }

  useEffect(() => {
    // const addRazorPayScript = async () => {
    //     const {data: keyId} = await axios.get('/api/config/razorpay')
    //     console.log(keyId)
    //     const script = document.createElement('script')
    //     script.type = 'text/javascript'
    //     script.src = "https://checkout.razorpay.com/v1/checkout.js"
    //     script.async = true
    //     script.onload = () => {
    //        setSdkReady(true)
    //     }
    //     document.body.appendChild(script)
    // }

   // if (!order || order._id !== orderId || successPay)



      if (!order || successPay || successDeliver){
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET})
      dispatch(getOrderDetails(orderId))
    }
    // else if (!order.isPaid){
    //     if (!window.razorpay){
    //         addRazorPayScript()
    //     }
        // else{
        //     setSdkReady(true)
        // } 
  }, [order, orderId, dispatch, successPay, successDeliver])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
     dispatch(deliverOrder(order))
  }

  console.log(order);
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1> Order {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup varient='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {' - '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>Delivered On {order.deliveredAt}</Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? 
               ( <Message variant='success'>Paid On {order.paidAt}</Message>)
                : (<Message variant='danger'>Not Paid</Message>)
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X Rs {item.price} = Rs{' '}
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs {order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs {order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs {order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs {order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button 
                  className='App-link' onSuccess={successPaymentHandler}
                  onClick={displayRazorpay}
                >
                  Proceed To Pay
                </Button>
              </ListGroup.Item>
              {loadingDeliver && <Loader />}
              {userInfo.isAdmin && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type = 'button' className='btn btn-block' onClick = {deliverHandler}>Mark As Delivered</Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen