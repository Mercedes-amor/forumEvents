
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // make sure to add your Stripe Secret Key to the .env
const isAuthenticated = require("../middlewares/isAuthenticated");
const Event = require("../models/Event.model");
const Payment = require("../models/Payment.model")
const User = require("../models/User.model")


router.post("/create-payment-intent", isAuthenticated, async (req, res, next) => {

  const productId = req.body._id; // this is how we will receive the productId the user is trying to purchase. This can also later be set to receive via params.
// console.log("productId",productId)

  try {

// ... "/create-payment-intent" route

// this is where you will get the correct price to be paid
const product = await Event.findById(productId)
console.log("product", product)
const priceToPay = product.price // if not stored in cents, make sure to convert them to cents

// ... payment intent creation
    // TODO . this is where you will later get the correct price to be paid

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceToPay,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // TODO on part 2. this is where you will later create a Payment Document later




await Payment.create({
    price: priceToPay,
    product: productId,
    status: "incomplete",
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    buyer: req.payload 
  })
  
  // ... res.send
    res.send({
      clientSecret: paymentIntent.client_secret, // the client secret will be sent to the FE after the stripe payment intent creation
    });
    
  } catch (error) {
    next(error)
  }
});


router.patch("/update-payment-intent", isAuthenticated, async (req, res, next) => {
    const { clientSecret, paymentIntentId } = req.body;
  
    try {
  
      const response = await Payment.findOneAndUpdate({
        clientSecret: clientSecret,
        paymentIntentId: paymentIntentId,
      },{ 
        status: "succeeded" 
      }, {new:true});

      // aqui tienen response.product = id del evento
      await User.findByIdAndUpdate(req.payload._id, {
        $push: { eventsAsistance: response.product },
      });
      

  
      res.status(200).json();
  
    } catch (error) {
      next(error);
    }
  });
  
 
  

module.exports = router























module.exports = router;