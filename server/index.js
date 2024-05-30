const express = require('express');
const path = require('path');
const app = express();
const port = 3000; 

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.post('/submitOrder', (req, res)=> {
    const { cardNumber, expiryDate, cvv, email, ...textbooks } = req.body;

    // Convert textbook quantities to numbers
    const quantities = Object.keys(textbooks).map(key => parseInt(textbooks[key], 10));

    // Simple server-side validation
    if (!cardNumber || !expiryDate || !cvv || !email) {
        return res.status(400).send({message: 'Payment information is incomplete.' });
    }

    const cardNumberRegex = /^[0-9]{8,16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    const cvvRegex = /^[0-9]{3,4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cardNumberRegex.test(cardNumber)) {
        return res.status(400).send('Invalid card number. It must be between 8 and 16 digits.');
    }
    if (!expiryDateRegex.test(expiryDate)) {
        return res.status(400).send('Invalid expiration date. Format must be mm/yy.');
    }
    if (!cvvRegex.test(cvv)) {
        return res.status(400).send('Invalid CVV. It must be 3 or 4 digits.');
    }
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email address.');
    }

    // Check if at least one textbook is ordered
    const validQuantities = quantities.filter(q => !isNaN(q) && q > 0);
    if (validQuantities.length === 0) {
        return res.status(400).send('Please order at least one textbook.');
    }

    // Further processing and order submission logic here

    // Example response
    return res.status(200).send('Order processed successfully. Thank you for your purchase!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});