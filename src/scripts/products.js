window.addEventListener("load", () => {
  const productList = document.getElementById("products-list");

  // Function to render products
  const renderProducts = (productsArray) => {
    productList.innerHTML = ""; // Clear the product list

    productsArray.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>Price: $${product.price}</p>
        <h4><a href="#">more..details...</a></h4>
        <button class="add-to-cart">Add to Cart</button>
      `;
      productList.appendChild(productDiv);

      // Add event listener to the "Add to Cart" button
      productDiv.querySelector(".add-to-cart").addEventListener("click", () => {
        addToCart(product);
      });
    });
  };

  // Function to add product to the cart
  const addToCart = (product) => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.push(product);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    alert(`${product.name} added to cart!`);
  };

  // Fetch products from localStorage (or fallback to empty array)
  const initialProducts = JSON.parse(localStorage.getItem("products")) || [];
  renderProducts(initialProducts);
});
