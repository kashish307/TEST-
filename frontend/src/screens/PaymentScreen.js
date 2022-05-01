import React, { useState }  from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { Form , Button, Col } from 'react-bootstrap'
import { register } from '../actions/userActions'
import { useDispatch, useSelect, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from "../components/CheckoutSteps"
import { savePaymentMethod } from "../actions/cartActions"

const PaymentScreen = () => {
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    if(!shippingAddress){
        navigate('/login/shipping')
    }
    
     const[paymentMethod, setPaymentMethod] = useState('Razorpay')

    const dispatch =useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
     dispatch(savePaymentMethod(paymentMethod))
      navigate('/placeorder')
    }
  return <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
      <Col>
      <Form.Check
      type="radio"
      label='UPI or Credit Card'
      id='Razorpay'
      name='paymentMethod'
      value='Razorpay'
      checked
      onChange={(e) => setPaymentMethod(e.target.value)}
      ></Form.Check>
      {/* <Form.Check
      type="radio"
      label='Stripe'
      id='Stripe'
      name='paymentMethod'
      value='Stripe'
      onChange={(e) => setPaymentMethod(e.target.value)}
      ></Form.Check> */}
      </Col>
      </Form.Group>
         <Button type='submit' variant="primary" className="btn">
             Continue
         </Button>
      </Form>
  </FormContainer>
    
}

export default PaymentScreen