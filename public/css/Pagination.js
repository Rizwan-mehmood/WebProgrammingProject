function Landing() {
    window.location.href = '/LandingPage.html';
}
const params = new URLSearchParams(window.location.search);
const data = params.get('value');
const userData = JSON.parse(data);
let searchedData;
let buttonNumber = 0;
fetch('/searchData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        input: userData.value,
    })
})
    .then(response => {
        if (!response.ok) {
            throw new Error("Couldn't get Data from server.")
        }
        return response.json();
    })
    .then(data => {
        // for (let i = 0; i < data.searchData.length; i++) {
        //     const div = document.createElement("div");
        //     div.innerHTML =
        //         `<p>${data.searchData[i].ProductName}</p>
        //     <p>${data.searchData[i].ProductPrice}$</p>
        //     <p>${data.searchData[i].ProductQuantity}</p>`;
        //     document.getElementById("result").appendChild(div);
        // }
        searchedData = data.searchData;
        buttonNumber = data.searchData.length / 5;
        console.log(data.searchData, buttonNumber);
        if (data.searchData.length % 5) {
            buttonNumber += 1;
        }
        let index = parseInt(buttonNumber);
        console.log(index);
        for (let i = 0; i < index; i++) {
            const button = document.createElement("button");
            button.classList.add("number");
            button.innerHTML = i + 1;
            button.setAttribute('onclick', 'show(this.innerHTML)');
            document.getElementById('footer').appendChild(button);
        }
        let start = 0;
        let end = start + 5;
        for (let i = start; i < end && i < searchedData.length; i++) {
            const div = document.createElement('div');
            div.innerHTML =
                `<p>${searchedData[i].ProductName}</p>
                <p>${searchedData[i].ProductPrice}</p>
                <p>${searchedData[i].ProductQuantity}</p>`
            document.getElementById('paginationData').appendChild(div);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


function show(element) {
    const parent = document.getElementById('paginationData');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    let start = (element - 1) * 5;
    let end = start + 5;
    for (let i = start; i < end && i < searchedData.length; i++) {
        const div = document.createElement('div');
        div.innerHTML =
            `<p>${searchedData[i].ProductName}</p>
        <p>${searchedData[i].ProductPrice}</p>
        <p>${searchedData[i].ProductQuantity}</p>`
        document.getElementById('paginationData').appendChild(div);
    }
}