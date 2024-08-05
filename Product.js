const phones = [
  {
    id: 1,
    model: "Vivo V40 Pro",
    price: '₹49,990',
    image: "https://cdn1.smartprix.com/rx-ihCwhkEQ6-w280-h280/vivo-v40-pro.webp",
  },
  {
    id: 2,
    model: "Xiaomi 15 Ultra",
    price: '₹21,999',
    image: "https://cdn1.smartprix.com/rx-iXIaTDqKC-w420-h420/xiaomi-15-ultra.webp",
  },
  {
    id: 3,
    model: "Motorola Edge 50 5G",
    price: '₹25,999',
    image: "https://cdn1.smartprix.com/rx-iH9xyx2Rs-w420-h420/motorola-edge-50-5g.webp",
  },
  {
    id: 4,
    model: "Apple iPhone 16",
    price: '₹82,999',
    image: "https://cdn1.smartprix.com/rx-iv7kdkTX4-w420-h420/apple-iphone-16.webp",
  },
];

const electronics = [
  {
    id: 1,
    model: "Sony God Of War Ragnarok",
    price: '₹2,849',
    image: "https://m.media-amazon.com/images/I/613lyxBIXoL._AC_UY327_FMwebp_QL65_.jpg",
  },
  {
    id: 2,
    model: "Dust Cover for Sony PS5 Console",
    price: '₹999',
    image: "https://m.media-amazon.com/images/I/71q9fzXSo+L._AC_UY327_FMwebp_QL65_.jpg",
  },
  {
    id: 3,
    model: "LG Washing Machine",
    price: '₹25,999',
    image: "https://m.media-amazon.com/images/I/71QnhNCgxKL._AC_UY327_FMwebp_QL65_.jpg",
  },
  {
    id: 4,
    model: "Xbox Series S",
    price: '₹35,999',
    image: "https://m.media-amazon.com/images/I/61-jjE67uqL._AC_UY327_FMwebp_QL65_.jpg",
  },
];

function createProductCards(products, productPageId, cardClass) {
  const productPage = document.getElementById(productPageId);
  if (!productPage) {
    console.error(`Element with ID ${productPageId} not found.`);
    return;
  }

  // Ensure we target the correct class
  const cardDiv = productPage.querySelector(`.${cardClass}`);
  if (!cardDiv) {
    console.error(`Element with class ${cardClass} not found.`);
    return;
  }

  // Remove existing cards if any
  const existingCards = productPage.querySelectorAll(`.${cardClass}`);
  existingCards.forEach(card => card.remove());

  // Clone the template and modify it for each product
  products.forEach((product, index) => {
    const clone = cardDiv.cloneNode(true);
    clone.style.display = 'block'; // Show cloned card

    // Setup product details
    const imgClone = clone.querySelector('.product-img');
    const h1Clone = clone.querySelector('.product-title');
    const h2Clone = clone.querySelector('.product-price');

    if (imgClone) imgClone.src = product.image;
    if (h1Clone) h1Clone.textContent = product.model;
    if (h2Clone) h2Clone.textContent = `Price: ${product.price}`;

    const stockDiv = clone.querySelector('.stock-div');
    const stockDisplay = stockDiv ? stockDiv.querySelector('.stock-display') : null;
    let count = 0;

    if (stockDisplay) {
      stockDisplay.id = `dis-${productPageId}-${index}`;
      stockDisplay.value = count;
      stockDisplay.readOnly = true;
      stockDisplay.style.textAlign = 'center';
    }

    const posBtn = stockDiv ? stockDiv.querySelector('button[data-action="increase"]') : null;
    const negBtn = stockDiv ? stockDiv.querySelector('button[data-action="decrease"]') : null;

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

    const wishlistBtn = clone.querySelector('.wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        alert(`Added ${product.model} to wishlist`);
      });
    }

    const buyBtn = clone.querySelector('.buy-btn');
    if (buyBtn) {
      buyBtn.addEventListener('click', async () => {
        const quantity = parseInt(stockDisplay ? stockDisplay.value : '0', 10);
        const rawPrice = product.price.replace(/[^0-9.-]+/g, ''); // Clean up the price string
        const price = parseFloat(rawPrice); // Convert to number
        const productImg = product.image;
        const productName = product.model;
    
        if (isNaN(quantity) || quantity < 1) {
          alert('Quantity must be at least 1 and be a valid number.');
          return;
        }
        if (isNaN(price) || price <= 0) {
          alert('Price must be a valid number and greater than 0.');
          return;
        }
    
        const requestBody = {
          productId: product.id,
          quantity,
          price,
          productImg,
          productName
        };
    
        console.log('Sending request body:', requestBody);
    
        try {
          const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
    
          if (response.ok) {
            const counterElement = document.getElementById("counter");
            if (counterElement) {
              let currentCount = parseInt(counterElement.textContent) || 0;
              currentCount++;
              counterElement.textContent = currentCount;
            }
    
            const order = await response.json();
            console.log('Order response:', order);
            alert('Order placed successfully!');
          } else {
            console.error('Error:', response.status, response.statusText);
            alert(`Failed to place order. Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error:', error.message);
          alert('Error: ' + error.message);
        }
      });
    }

    // Append the cloned card to the product page
    productPage.appendChild(clone);
  });
}

// Initialize product cards on page load
document.addEventListener('DOMContentLoaded', () => {
  createProductCards(phones, 'product-page', 'cards');
  createProductCards(electronics, 'electronics-page', 'cards');
});
