// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'myshoppyyacc@gmail.com',
    pass: 'xxfh rohe nmef pncl'   // App password (spaces are fine)
  }
});

// Order endpoint
app.post('/api/order', async (req, res) => {
  const order = req.body;

  const adminMailOptions = {
    from: 'myshoppyyacc@gmail.com',
    to: 'myshoppyyacc@gmail.com', // you can change this to your admin email
    subject: `🛒 New Order Received - ${order.order_id}`,
    html: `
      <h2>New Order Details</h2>
      <p><strong>Order ID:</strong> ${order.order_id}</p>
      <p><strong>Customer Name:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>Phone:</strong> ${order.customer_phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Payment Method:</strong> ${order.payment_method}</p>
      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `<li>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> ₹${order.total}</p>
    `
  };

  // Optional: send confirmation to customer
  const customerMailOptions = {
    from: 'myshoppyyacc@gmail.com',
    to: order.customer_email,
    subject: `Order Confirmation - ${order.order_id}`,
    html: `
      <h2>Thank you for your order, ${order.customer_name}!</h2>
      <p>Your order #${order.order_id} has been received.</p>
      <p>We'll notify you when it ships.</p>
      <p>Order details:</p>
      <ul>
        ${order.items.map(item => `<li>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p>Payment method: Cash on Delivery</p>
    `
  };

  try {
    await transporter.sendMail(adminMailOptions);
    // Uncomment the next line if you want to send a confirmation to the customer
    // await transporter.sendMail(customerMailOptions);
    res.status(200).json({ success: true, message: 'Order placed and notification sent.' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send email notifications.' });
  }
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: 'myshoppyyacc@gmail.com',
    to: 'myshoppyyacc@gmail.com',
    subject: `New Contact Message from ${name}`,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact email failed:', error);
    res.status(500).json({ success: false });
  }
});

// Serve static frontend files (if you want to host everything together)
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
