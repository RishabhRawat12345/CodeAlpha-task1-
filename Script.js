document.addEventListener('DOMContentLoaded', function() {
    console.log('Script.js loaded');

    const cardImage = document.getElementById('card-img');
    const images = [
        './images/card1.jpg',
        './images/card2.jpg',
        './images/card3.png',
        './images/card4.jpg'
    ];
    cardImage.src = images[0];
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        cardImage.src = images[currentIndex];
        console.log(images[currentIndex]);
    }, 5000);

    const productImages = [
        './images/product1.jpg',
        './images/product2.jpg',
        './images/product3.jpg',
        './images/product4.jpg',
        './images/product5.jpg',
        './images/product6.jpg',
        './images/product7.jpg',
        './images/product8.jpg'
    ];
    const productImageElements = document.querySelectorAll('.product img');
    productImageElements.forEach((img, index) => {
        img.src = productImages[index];
    });

    const phones = [
        { id: 1, model: "Vivo V40 Pro", price: '₹49,990', image: "https://cdn1.smartprix.com/rx-ihCwhkEQ6-w280-h280/vivo-v40-pro.webp" },
        { id: 2, model: "Xiaomi 15 Ultra", price: '₹21,999', image: "https://cdn1.smartprix.com/rx-iXIaTDqKC-w420-h420/xiaomi-15-ultra.webp" },
        { id: 3, model: "Motorola Edge 50 5G", price: '₹25,999', image: "https://cdn1.smartprix.com/rx-iH9xyx2Rs-w420-h420/motorola-edge-50-5g.webp" },
        { id: 4, model: "Apple iPhone 16", price: '₹82,999', image: "https://cdn1.smartprix.com/rx-iv7kdkTX4-w420-h420/apple-iphone-16.webp" },
    ];

    const electronics = [
        { id: 1, model: "Sony God Of War Ragnarok", price: '₹2,849', image: "https://m.media-amazon.com/images/I/613lyxBIXoL._AC_UY327_FMwebp_QL65_.jpg" },
        { id: 2, model: "Dust Cover for Sony PS5 Console", price: '₹999', image: "https://m.media-amazon.com/images/I/71q9fzXSo+L._AC_UY327_FMwebp_QL65_.jpg" },
        { id: 3, model: "LG Washing Machine", price: '₹25,999', image: "https://m.media-amazon.com/images/I/71QnhNCgxKL._AC_UY327_FMwebp_QL65_.jpg" },
        { id: 4, model: "Xbox Series S", price: '₹35,999', image: "https://m.media-amazon.com/images/I/61-jjE67uqL._AC_UY327_FMwebp_QL65_.jpg" },
    ];

    function createProductCards(products, productPageId, cardClass) {
        const productPage = document.getElementById(productPageId);
        if (!productPage) {
            console.error(`Element with ID ${productPageId} not found.`);
            return;
        }

        const cardDiv = productPage.querySelector(`.${cardClass}`);
        if (!cardDiv) {
            console.error(`Element with class ${cardClass} not found.`);
            return;
        }

        cardDiv.remove();

        products.forEach((product, index) => {
            const clone = cardDiv.cloneNode(true);
            const imgClone = clone.querySelector('img');
            const h1Clone = clone.querySelector('h1');
            const h2Clone = clone.querySelector('h2');

            if (imgClone) imgClone.src = product.image;
            if (h1Clone) h1Clone.textContent = product.model;
            if (h2Clone) h2Clone.textContent = `Price: ${product.price}`;

            const stockDiv = clone.querySelector('.stock-div');
            const stockDisplay = stockDiv ? stockDiv.querySelector('input') : null;
            if (stockDisplay) {
                stockDisplay.id = `dis-${productPageId}-${index}`;
                stockDisplay.value = 0;
                stockDisplay.readOnly = true;
                stockDisplay.style = 'text-align:center';
            }

            const posBtn = stockDiv ? stockDiv.querySelector('button#Pos') : null;
            const negBtn = stockDiv ? stockDiv.querySelector('button#Neg') : null;

            const wishlistBtn = clone.querySelector('button#wishlist');
            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', () => {
                    alert(`Added ${product.model} to wishlist`);
                });
            }

            const buyBtn = clone.querySelector('button#buy');
            if (buyBtn) {
                buyBtn.addEventListener('click', async () => {
                    const quantity = stockDisplay ? stockDisplay.value : 0;
                    const price = product.price;
                    const productImg = product.image;
                    const productName = product.model;

                    try {
                        const response = await fetch('http://localhost:5000/api/orders', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ productId: product.id, quantity, price, productImg, productName }),
                        });

                        if (response.ok) {
                            const counterElement = document.getElementById("counter");
                            if (counterElement) {
                                let currentCount = parseInt(counterElement.textContent) || 0;
                                currentCount++;
                                counterElement.textContent = currentCount;
                            }

                            const order = await response.json();
                            console.log(order);
                            alert('Order placed successfully!');

                            const imageContainer = document.getElementById("image-container");
                            if (imageContainer) {
                                const imgElement = document.createElement("img");
                                imgElement.src = order.productImg;
                                imgElement.alt = "Order Image";
                                imageContainer.appendChild(imgElement);

                                const namqDiv = document.createElement("div");
                                namqDiv.className = "namq";
                                const h1Element = document.createElement("h1");
                                h1Element.textContent = order.productName;
                                namqDiv.appendChild(h1Element);
                                const h2Element = document.createElement("h2");
                                h2Element.textContent = `Price: ${order.price}`;
                                namqDiv.appendChild(h2Element);
                                imageContainer.appendChild(namqDiv);

                                const moneyElement = document.createElement("h1");
                                moneyElement.className = "money";
                                moneyElement.textContent = `Price: ${order.price}`;
                                imageContainer.appendChild(moneyElement);
                            }
                        } else {
                            console.error('Error:', response.status, response.statusText);
                            alert('Failed to place order.');
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                        alert('Error: ' + error.message);
                    }
                });
            }

            let count = 0;
            if (posBtn) posBtn.addEventListener('click', () => {
                count++;
                if (stockDisplay) stockDisplay.value = count;
            });

            if (negBtn) negBtn.addEventListener('click', () => {
                if (count > 0) {
                    count--;
                    if (stockDisplay) stockDisplay.value = count;
                }
            });

            productPage.appendChild(clone);
        });
    }

    createProductCards(phones, 'product-page', 'cards');
    createProductCards(electronics, 'electronics-page', 'cards2');
});
