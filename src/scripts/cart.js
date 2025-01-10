window.addEventListener("load", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalAmountElement = document.getElementById("total-amount");

  // Function to render cart items
  const renderCartItems = (cartItems) => {
    cartItemsContainer.innerHTML = ""; // Clear the cart items list

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
    } else {
      let totalAmount = 0;

      cartItems.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h2>${item.name}</h2>
          <p>Price: $${item.price}</p>
          <button class="remove" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
        totalAmount += item.price;
      });

      totalAmountElement.textContent = `Total: $${totalAmount}`;
    }

    // Add event listeners to the remove buttons
    Array.from(document.querySelectorAll(".remove")).forEach((button) =>
      button.addEventListener("click", handleRemoveItem)
    );
  };

  // Handle removing an item from the cart
  const handleRemoveItem = (event) => {
    const itemIndex = event.target.getAttribute("data-index");
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.splice(itemIndex, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderCartItems(cartItems);
  };

  // Fetch cart items from localStorage (or fallback to empty array)
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  renderCartItems(cartItems);

  // Handle checkout button click (placeholder functionality)
  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Proceeding to checkout...");
  });
});
