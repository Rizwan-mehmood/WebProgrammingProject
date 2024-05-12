fetch('/fetchProducts', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error("Couldn't get Data from server.")
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            let productDiv = document.createElement('div');
            productDiv.classList.add('values');
            productDiv.innerHTML = `
        <div style="width: 230px;">
            <p>${data[i].ProductName}</p>
        </div>
        <div style="width: 230px;">
            <p>${data[i].ProductPrice}</p>
        </div>
        <div style="width: 230px;">
            <p>${data[i].ProductQuantity}</p>
        </div>
        <div style="width: 280px;">
            <p>${data[i].SellerEmail}</p>
        </div>
        <div style="width: 198px; border-right: none">
            <p>${data[i].SellerName}</p>
        </div>
    `;
            document.getElementById('tableData').appendChild(productDiv);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle error here, e.g., show an error message to the user
    });

function logout() {
    window.location.href = '/LoginPage.html';
}