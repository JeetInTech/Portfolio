document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json(); // Parse the JSON response
        console.log('Response status:', response.status);
        console.log('Response body:', result);

        if (result.success) {
            alert('Email sent successfully!');
        } else {
            alert(result.message || 'Failed to send email. Please try again.');
        }
    } 
    catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email. Please try again later.');
    }
});
