async function fetchCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; 

    try {
        const response = await fetch('http://localhost:5000/api/cart');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const orders = await response.json();

        if (orders.length === 0) {
            cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
            return;
        }

        orders.forEach(order => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';

            const img = document.createElement('img');
            img.src = order.productImg;
            img.alt = order.productName;

            const detailsDiv = document.createElement('div');

            const name = document.createElement('h1');
            name.textContent = order.productName;

            const price = document.createElement('h2');
            price.textContent = `Price: ${order.price}`;

            const quantity = document.createElement('h3');
            quantity.textContent = `Quantity: ${order.quantity}`;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = async function() {
                try {
                    const response = await fetch(`http://localhost:5000/api/orders/${order.productId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    console.log('Item removed from cart!');
                    fetchCartItems(); 
                } catch (error) {
                    console.error(`Error removing cart item: ${error}`);
                }
            };

            detailsDiv.appendChild(name);
            detailsDiv.appendChild(price);
            detailsDiv.appendChild(quantity);
            detailsDiv.appendChild(removeBtn);

            cartItemDiv.appendChild(img);
            cartItemDiv.appendChild(detailsDiv);

            cartItemsContainer.appendChild(cartItemDiv);
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        cartItemsContainer.innerHTML = '<p>Error loading cart items.</p>';
    }
}

async function clearCart() {
    try {
        const response = await fetch('http://localhost:5000/api/cart', {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const message = await response.json();
        alert(message.message);
        document.getElementById('cart-items').innerHTML = ''; 
    } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Error clearing cart.');
    }
}

window.onload = fetchCartItems;