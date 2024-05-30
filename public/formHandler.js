document.getElementById('orderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // Create a summary of selected textbooks
    let textbookSummary = 'You have selected the following textbooks:\n';
    let selectedTextbooks = false;
    for (let key in formObject) {
        if (key.startsWith('textbook') && formObject[key] > 0) {
            textbookSummary += `${key}: ${formObject[key]} copies\n`;
            selectedTextbooks = true;
        }
    }

    if (!selectedTextbooks) {
        document.getElementById('responseMessage').textContent = 'Please select at least one textbook.';
        return;
    }

    // Prompt user for confirmation
    if (!window.confirm(textbookSummary + '\nDo you want to proceed with the order?')) {
        return;
    }

    // Basic validation
    const cardNumberRegex = /^[0-9]{8,16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    const cvvRegex = /^[0-9]{3,4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formObject.cardNumber || !formObject.expiryDate || !formObject.cvv || !formObject.email) {
        document.getElementById('responseMessage').textContent = 'Please fill in all payment information';
        return;
    }

    if (!cardNumberRegex.test(formObject.cardNumber)) {
        document.getElementById('responseMessage').textContent = 'Invalid card number. It must be between 8 and 16 digits.';
        return;
    }
    if (!expiryDateRegex.test(formObject.expiryDate)) {
        document.getElementById('responseMessage').textContent = 'Invalid expiration date. Format must be mm/yy.';
        return;
    }
    if (!cvvRegex.test(formObject.cvv)) {
        document.getElementById('responseMessage').textContent = 'Invalid CVV. It must be 3 or 4 digits.';
        return;
    }
    if (!emailRegex.test(formObject.email)) {
        document.getElementById('responseMessage').textContent = 'Invalid email address';
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

        document.getElementById('responseMessage').textContent = message;

        if (response.ok) {
            // Clear the form after successful submission
            event.target.reset();
        } 
    } catch (error) {
        document.getElementById('responseMessage').textContent = `Error: ${error.message}`;
    }
});