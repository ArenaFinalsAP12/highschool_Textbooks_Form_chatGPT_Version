document.getElementById('orderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // Basic validation
    if (!formObject.cardNumber || !formObject.expiryDate || !formObject.cvv) {
        document.getElementById('responseMessage').textContent = 'Please fill in all payment information.';
        return;
    }

    // Fetch request to server
    try {
        const response = await fetch('/submitOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });

        // const result = await response.json();
        const message = await response.text();

        if (response.ok) {
            // document.getElementById('responseMessage').textContent = 'Order submitted successfully!';
            // Clear the form after successful submission
            event.target.reset();
        } // else {
            // document.getElementById('responseMessage').textContent = `Error: ${result.message}`;
        //}
    } catch (error) {
        document.getElementById('responseMessage').textContent = `Error: ${error.message}`;
    }
});