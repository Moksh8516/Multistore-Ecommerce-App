
import Stripe from "stripe"
const stripe = new Stripe(process.env.PAYMENT_GATEWAY_SECRET_KEY)
import { asyncHandler } from "../utils/asyncHandler.js";

// const calculateOrderAmount = (items) => {
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   // let total = 0;
//   // items.forEach((item) => {
//   //   total += item.amount;
//   // });
//   return 1000;
// };

export const paymentHandler = asyncHandler(async (req, res) => {
  const { currentOrder } = req.body;
  console.log("hell", currentOrder)
  const lineItems = currentOrder.orderItems.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.title,
        images: [product.thumbnail]
      },
      unit_amount: parseInt(product.price * 100)
    },
    quantity: product.quantity
  }));
  console.log(typeof (lineItems))
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/orderSuccess`,
      cancel_url: "http://localhost:5173/cancel",
    });

    console.log(`Session created: ${session.id}`);
    console.log(`Session URL: ${session.url}`);

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(`Error creating checkout session: ${err.message}`);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }

})