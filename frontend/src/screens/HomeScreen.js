import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import Message from '../components/Message'
import Product from '../components/Product'
import Loader from '../components/Loader'
import { listProducts } from '../actions/productActions'

const HomeScreen = () => {
  const dispatch =  useDispatch()
  const navigate = useNavigate()
  const productList = useSelector(state => state.productList)
  const { loading, error, products } = productList
  
  useEffect(() => {
    dispatch(listProducts())
  },[dispatch])

  return (
    <>
    <h1>Latest Products</h1>
    {
      loading ? (
        <Loader />
      ) : error ? (
        <Message variant = 'danger'>(error)</Message>
      ) : (
    <Row>
        {products.map(product => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product ={ product }/>
            </Col>
        ))}
    </Row>
      )
        }
      </>
  )
}
export default HomeScreen