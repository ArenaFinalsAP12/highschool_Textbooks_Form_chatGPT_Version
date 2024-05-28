const express = require('express');
const path = require('path');
const app = express();
const port = 3000; 

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.post('/submitOrder', (req, res)=> {
    const { cardNumber, expiryDate, cvv, ...textbooks } = req.body;

    // Convert textbook quantities to numbers
    const quantities = Object.keys(textbooks).map(key => parseInt(textbooks[key], 10));

    // Simple server-side validation
    if (!cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({message: 'Payment information is incomplete.' });
    }

    // Check if at least one textbook is ordered
    const validQuantities = quantities.filter(q => !isNaN(q) && q > 0);
    if (validQuantities.length === 0) {
        // return res.status(400).json({message: 'Please order at least one textbook.' });
        // Changed the above code to use res.send() to send an appropriate response message
        return res.status(400).send('Please order at least one textbook.');
    }

    // Further processing and order submission logic here

    // Example response
    // res.status(200).json({message: 'Order processed successfully.'});
    // Changed the above code to use res.send() to send an appropriate response message
    return res.status(200).send('Order processed successfully. Thank you for your purchase!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});