import React from 'react'
import { Nav } from 'react-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
        <Nav.Item className='step'>
            {step1 ? (
                <Nav.Link href='/login'>
                    <Nav.Link>Sign In</Nav.Link>
                </Nav.Link>
            ) : (
                <Nav.Link disabled>Sign In</Nav.Link>
            )}
        </Nav.Item>

        <Nav.Item className='step'>
            {step2 ? (
                <Nav.Link href='/login/shipping'>
                    <Nav.Link>Shipping</Nav.Link>
                </Nav.Link>
            ) : (
                <Nav.Link disabled>Shipping</Nav.Link>
            )}
        </Nav.Item>

        <Nav.Item className='step'>
            {step3 ? (
                <Nav.Link href='/payment'>
                    <Nav.Link>Payment</Nav.Link>
                </Nav.Link>
            ) : (
                <Nav.Link disabled>Payment</Nav.Link>
            )}
        </Nav.Item>

        <Nav.Item className='step'>
            {step4 ? (
                <Nav.Link href='/placeorder'>
                    <Nav.Link>Place Order</Nav.Link>
                </Nav.Link>
            ) : (
                <Nav.Link disabled>Place Order</Nav.Link>
            )}
        </Nav.Item>

    </Nav>
  )
}

export default CheckoutSteps
