import React, { useState, useEffect } from 'react'
import { useSelector , useDispatch } from 'react-redux'
import {Link, useParams , useNavigate} from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails } from '../actions/productActions'

const ProductScreen = ({}) =>{
  const navigate =useNavigate();
  const {id}= useParams()
  const [qty, setQty] =useState(0)

  const dispatch = useDispatch()
  const productDetails = useSelector(state => state.productDetails)
  const {loading, error, product} =productDetails

  useEffect(() => {
    dispatch(listProductDetails(id))
    }, [dispatch, id] )

    const addToCartHandler = () => {
      navigate(`/cart/${id}?qty=${qty}`)
    }

  return (<>
    <Link className='btn btn-light my-3' to="/">
      Go Back
    </Link>
    {loading ? <Loader />: error ? <Message varient ='danger'>{error}</Message> : (
      <Row>
      <Col md={6}>
      <Image src={product.image} alt={product.name} fluid />
      </Col>
      <Col md={3}>
        <ListGroup varient='flush'>
          <ListGroup.Item>
            <h3>{product.name}</h3>
          </ListGroup.Item>
        <ListGroup.Item>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} color="orange" />
        </ListGroup.Item>
        <ListGroup.Item>
          Price: Rs{product.price}
        </ListGroup.Item>
        <ListGroup.Item>
          Condition: {product.condition}
        </ListGroup.Item>
        <ListGroup.Item>
          Description: {product.description}
        </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={3}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Row>
              <Col>Price:</Col>
              <Col><strong>Rs{product.price}</strong></Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
              <Col>Status:</Col>
              <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
              </Row>
            </ListGroup.Item>
            {product.countInStock > 0 && (
              <ListGroupItem >
                <Row>
                  <Col>Qty</Col>
                  <Col>
                  <Form.Control
                  as= 'select'
                  value = {qty}
                  onChange ={(e) => setQty(e.target.value)}
                  >
                   { [...Array(product.countInStock).keys()].map(x => (
                      <option key ={x + 1} value ={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Control>
                  </Col>
                </Row>
              </ListGroupItem>
            )}
            <ListGroup.Item>
              <Button 
              onClick = {addToCartHandler} //adds the product to the cart
              className='btn-block' 
              type='button' 
              disabled={product.countInStock === 0}>
              Add To Cart
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
    )}
  </>)
}
export default ProductScreen