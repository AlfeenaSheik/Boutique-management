let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

let products = [
    {
        id: 1,
        name: 'Navy blue gown',
        img: 'g1.PNG',
        price: 15000
    },
    {
        id: 2,
        name: 'Floral gown',
        img: 'g2.PNG',
        price: 18000
    },
    {
        id: 3,
        name: 'Shararas',
        img: 'g3.PNG',
        price: 22000
    },
    {
        id: 4,
        name: 'Brown gown',
        img: 'g4.PNG',
        price: 15000
    },
    {
        id: 5,
        name: 'Lehenga',
        img: 'g5.PNG',
        price: 18000
    },
    {
        id: 6,
        name: 'Yellow gown',
        img: 'g6.PNG',
        price: 15000
    }
];
let listCards  = [];
function initApp(){
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="img/${value.img}">
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCard(${key})">Add To Card</button>`;
        list.appendChild(newDiv);
    })
}
initApp();
function addToCard(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
        // Send POST request to backend to add product to cart
        fetch('/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:key,
                name:key,
                quantity: 1,
            })
        })
        .then(response => {
            if(response.ok) {
                console.log('Product added to cart successfully');
            } else {
                console.error('Failed to add product to cart');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    reloadCard();
}
function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key)=>{
        totalPrice = totalPrice + value.price;
        count = count + value.quantity;
        if(value != null){
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="img/${value.img}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>`;
                listCard.appendChild(newDiv);
        }
    })
    total.innerText = totalPrice.toLocaleString();
    quantity.innerText = count;
}
//
function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key].price = quantity * products[key].price;
    }

    reloadCard();
}
function nxt(){
    window.location.assign("homepage.html");
}
function buy(){
    window.location.assign("buy.html");
}

function fetchDetailsFromPage() {
    let details = [];

    // Get all item elements
    let items = document.querySelectorAll('.item');

    // Loop through each item
    items.forEach(item => {
        let id = item.dataset.id; // Assuming you have a data attribute for id
        let name = item.querySelector('.title').innerText;
        let priceStr = item.querySelector('.price').innerText;
        let price = parseFloat(priceStr.replace(/[^0-9.-]+/g,"")); // Remove non-numeric characters from price string
        details.push({ id, name, price });
    });

    return details;
}

// Example usage
let pageDetails = fetchDetailsFromPage();
console.log(pageDetails);
