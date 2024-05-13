let values;
let divs = document.querySelectorAll('#tables>div');
console.log(divs[1].style.backgroundColor);
function show() {
    const table = document.getElementById('table');
    let length = table.rows.length;
    for (let i = length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
    if (divs[0].style.backgroundColor == 'rgb(90, 25, 152)') {
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
                values = data;
                for (let i = 0; i < data.length; i++) {
                    const table = document.getElementById('table');
                    const row = table.insertRow();
                    for (let j = 0; j < 6; j++) {
                        const cell = row.insertCell(j);
                        if (j == 0) {
                            cell.innerHTML = data[i].id;
                        }
                        if (j == 1) {
                            cell.innerHTML = data[i].ProductName;
                        }
                        if (j == 2) {
                            cell.innerHTML = data[i].ProductPrice + ' $';
                        }
                        if (j == 3) {
                            cell.innerHTML = data[i].ProductQuantity;
                        }
                        if (j == 4) {
                            cell.innerHTML = data[i].SellerEmail;
                        }
                        if (j == 5) {
                            cell.innerHTML = data[i].SellerName;
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }
    else {
        fetch('/fetchUsers', {
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
                values = data;
                for (let i = 0; i < data.length; i++) {
                    const table = document.getElementById('table');
                    const row = table.insertRow();
                    for (let j = 0; j < 6; j++) {
                        const cell = row.insertCell(j);
                        if (j == 0) {
                            cell.innerHTML = data[i].id;
                        }
                        if (j == 1) {
                            cell.innerHTML = data[i].fname;
                        }
                        if (j == 2) {
                            cell.innerHTML = data[i].lname;
                        }
                        if (j == 3) {
                            cell.innerHTML = data[i].email;
                        }
                        if (j == 4) {
                            cell.innerHTML = data[i].phone;
                        }
                        if (j == 5) {
                            cell.innerHTML = data[i].image_path;
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
const th = document.querySelectorAll('#head>th');
show();
document.querySelector('#tables>div:nth-child(1)').addEventListener('click', function (e) {
    document.querySelector('#tables>div:nth-child(1)').style.backgroundColor = 'rgb(90, 25, 152)';
    document.querySelector('#tables>div:nth-child(2)').style.backgroundColor = 'blueviolet';
    th[0].innerHTML = 'Product Id';
    th[1].innerHTML = 'Product Name';
    th[2].innerHTML = 'Product Price';
    th[3].innerHTML = 'Product Quantity';
    th[4].innerHTML = 'Seller Email';
    th[5].innerHTML = 'Seller Name';
    show();
});
document.querySelector('#tables>div:nth-child(2)').addEventListener('click', function (e) {
    document.querySelector('#tables>div:nth-child(2)').style.backgroundColor = 'rgb(90, 25, 152)';
    document.querySelector('#tables>div:nth-child(1)').style.backgroundColor = 'blueviolet';
    th[0].innerHTML = 'User Id';
    th[1].innerHTML = 'First Name';
    th[2].innerHTML = 'Last Name';
    th[3].innerHTML = 'Email';
    th[4].innerHTML = 'Phone';
    th[5].innerHTML = 'Image Path';
    show();
});
function logout() {
    window.location.href = '/LoginPage.html';
}
function Landing() {
    window.location.href = '/LandingPage.html';
}

document.querySelector('#input>input').addEventListener('input', function () {
    const table = document.getElementById('table');
    let length = table.rows.length;
    for (let i = length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
    fetch('/searchData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            input: this.value
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't get Data from server.")
            }
            return response.json();
        })
        .then(data => {
            if (data.searchData) {
                data = data.searchData;
            }
            for (let i = 0; i < data.length; i++) {
                const table = document.getElementById('table');
                const row = table.insertRow();
                for (let j = 0; j < 6; j++) {
                    const cell = row.insertCell(j);
                    if (j == 0) {
                        cell.innerHTML = data[i].id;
                    }
                    if (j == 1) {
                        cell.innerHTML = data[i].ProductName;
                    }
                    if (j == 2) {
                        cell.innerHTML = data[i].ProductPrice + ' $';
                    }
                    if (j == 3) {
                        cell.innerHTML = data[i].ProductQuantity;
                    }
                    if (j == 4) {
                        cell.innerHTML = data[i].SellerEmail;
                    }
                    if (j == 5) {
                        cell.innerHTML = data[i].SellerName;
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.querySelector('#first>input').addEventListener("input", function () {
    if (this.value) {
        let id = this.value;
        let flag = true;
        if (values[0].ProductName) {
            for (let i = 0; i < values.length; i++) {
                if (values[i].id == id) {
                    flag = false;
                    const inputs = document.querySelectorAll('#second>input');
                    inputs[0].value = values[id].ProductName;
                    inputs[1].value = values[id].ProductPrice;
                    inputs[2].value = values[id].ProductQuantity;
                    inputs[3].value = values[id].SellerEmail;
                    inputs[4].value = values[id].SellerName;
                    for (let i = 0; i < inputs.length; i++) {
                        inputs[i].style.display = 'block';
                    }
                }
            }
        }
        else {
            for (let i = 0; i < values.length; i++) {
                if (values[i].id == id) {
                    id = id - 1;
                    flag = false;
                    const inputs = document.querySelectorAll('#second>input');
                    inputs[0].value = values[id].fname;
                    inputs[1].value = values[id].lname;
                    inputs[2].value = values[id].email;
                    inputs[3].value = values[id].phone;
                    inputs[4].value = values[id].image_path;
                    for (let i = 0; i < inputs.length; i++) {
                        inputs[i].style.display = 'block';
                    }
                }
            }
        }
        if (flag) {
            const inputs = document.querySelectorAll('#second>input');
            inputs[0].value = "";
            inputs[1].value = "";
            inputs[2].value = "";
            inputs[3].value = "";
            inputs[4].value = "";
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].style.display = 'none';
            }
        }
    }
    else {
        const inputs = document.querySelectorAll('#second>input');
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
        inputs[4].value = "";
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.display = 'none';
        }
    }
});

function updateData() {
    const id = document.querySelector("#first>input").value;
    const ProductName = document.querySelector("#second>input:nth-child(1)").value;
    const ProductPrice = document.querySelector("#second>input:nth-child(2)").value;
    const ProductQuantity = document.querySelector("#second>input:nth-child(3)").value;
    const SellerEmail = document.querySelector("#second>input:nth-child(4)").value;
    const SellerName = document.querySelector("#second>input:nth-child(5)").value;
    fetch('/updateData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            ProductName: ProductName,
            ProductPrice: ProductPrice,
            ProductQuantity: ProductQuantity,
            SellerEmail: SellerEmail,
            SellerName: SellerName
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't get Data from server.")
            }
            return response.json();
        })
        .then(data => {
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
    return;
}
document.getElementById('form').addEventListener('submit', function (element) {
    element.preventDefault();
    const id = document.querySelector("#first>input").value;
    fetch('/deleteData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't get Data from server.")
            }
            return response.json();
        })
        .then(data => {
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        });
});