import dotenv from 'dotenv'
import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'

dotenv.config()

const router = express.Router()

router.post('/api/orders', async (req, res) => {
  console.log(req.body);
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_ID,
    })

      // console.log(req);
    //        const addDecimals = (num) => {
    //   return (Math.round(num * 100) / 100).toFixed(2)
    // }

    console.log("HII from api orders");
    
    
    
// const addDecimals = (num) => {
//       return (Math.round(num * 100) / 100).toFixed(2)
//     }

//     order.itemsPrice = addDecimals(
//       order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0)
//     )

//     order.shippingPrice = addDecimals(order.itemsPrice > 300 ? 0 : 40)

//     order.taxPrice = addDecimals(Number((0.15 * order.itemsPrice).toFixed(2)))

//     order.totalPrice = (
//       Number(order.itemsPrice) +
//       Number(order.shippingPrice) +
//       Number(order.taxPrice)
//     ).toFixed(2)

    //console.log(order.totalPrice)

    const options = {
      amount: req.body.price*100,
      currency: 'INR',
      receipt: 'receipt_order_74394',
    }

    const order = await instance.orders.create(options)

    if (!order) return res.status(500).send('Some error occured')
    res.json(order)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/api/success', async (req, res) => {
  try {
    // getting the details back from our font-end

    // console.log(req.body);

    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac('sha256','Mz5hlqppe8gmxWk8MBYJrpnZ')

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`)

    const digest = shasum.digest('hex')

    // console.log("digest:  "+digest);

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' })

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.json({
      msg : 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
})

export default router