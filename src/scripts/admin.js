document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM elements
    const addProductBtn = document.getElementById("add-new-product");
    const addProductForm = document.getElementById("add-product-form");
    const productList = document.getElementById("product-list");
    const productForm = document.getElementById("product-form");
    const imageInput = document.getElementById("image");
    const imagePreview = document.getElementById("image-preview");
    const saveChangesBtn = document.getElementById("save-changes");
    const discardChangesBtn = document.getElementById("discard-changes");
    
    const userList = document.getElementById("user-list");
    const addUserBtn = document.getElementById("add-new-user");
    const addUserForm = document.getElementById("add-user-form");
    const userForm = document.getElementById("user-form");
    const userRoleInput = document.getElementById("user-role");
    const saveUserChangesBtn = document.getElementById("save-user-changes");
    const discardUserChangesBtn = document.getElementById("discard-user-changes");
    
    let editingProductIndex = null;
    let editingUserIndex = null;

    // Render products from localStorage
    const renderProducts = (products) => {
        productList.innerHTML = ""; // Clear the product list
        products.forEach((product, index) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>Price: $${product.price}</p>
                <p>Description: ${product.description}</p>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            `;
            productList.appendChild(productDiv);
        });

        // Add event listeners for delete and edit buttons
        Array.from(document.querySelectorAll(".delete")).forEach((button) =>
            button.addEventListener("click", handleDeleteProduct)
        );
        Array.from(document.querySelectorAll(".edit")).forEach((button) =>
            button.addEventListener("click", handleEditProduct)
        );
    };

    // Handle deleting a product
    const handleDeleteProduct = (event) => {
        const productIndex = event.target.getAttribute("data-index");
        fetch(`http://localhost:3000/products/${productIndex}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            let products = JSON.parse(localStorage.getItem("products")) || [];
            products.splice(productIndex, 1);
            localStorage.setItem("products", JSON.stringify(products));
            renderProducts(products);
        });
    };

    // Handle editing a product
    const handleEditProduct = (event) => {
        editingProductIndex = event.target.getAttribute("data-index");
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const productToEdit = products[editingProductIndex];
        fillProductFormWithData(productToEdit);
        addProductForm.style.display = "block";
        saveChangesBtn.style.display = "inline-block";
        discardChangesBtn.style.display = "inline-block";
        addProductBtn.style.display = "none";
    };

    // Fill form with product data
    const fillProductFormWithData = (product) => {
        imagePreview.style.display = "block";
        imagePreview.src = product.image;
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;
    };

    // Handle saving product changes
    const handleSaveChanges = () => {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        const updatedProduct = {
            image: imagePreview.src,
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value,
        };

        fetch(`http://localhost:3000/products/${editingProductIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => response.json())
        .then(() => {
            products[editingProductIndex] = updatedProduct;
            localStorage.setItem("products", JSON.stringify(products));
            resetProductForm();
            renderProducts(products);
            editingProductIndex = null;
        });
    };

    // Handle discarding product changes
    const handleDiscardChanges = () => {
        resetProductForm();
        editingProductIndex = null;
    };

    // Reset the product form and hide elements
    const resetProductForm = () => {
        productForm.reset();
        imagePreview.style.display = "none";
        addProductForm.style.display = "none";
        saveChangesBtn.style.display = "none";
        discardChangesBtn.style.display = "none";
        addProductBtn.style.display = "inline-block";
    };

    // Handle adding a new product or editing an existing one
    const handleProductFormSubmit = (event) => {
        event.preventDefault();
        const newProduct = {
            image: imagePreview.src,
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            description: document.getElementById("description").value,
        };

        let products = JSON.parse(localStorage.getItem("products")) || [];
        if (editingProductIndex !== null) {
            fetch(`http://localhost:3000/products/${editingProductIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            })
            .then(response => response.json())
            .then(() => {
                products[editingProductIndex] = newProduct;
                editingProductIndex = null;
                localStorage.setItem("products", JSON.stringify(products));
                resetProductForm();
                renderProducts(products);
            });
        } else {
            fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            })
            .then(response => response.json())
            .then((product) => {
                products.push(product);
                localStorage.setItem("products", JSON.stringify(products));
                resetProductForm();
                renderProducts(products);
            });
        }
    };

    // Event listener for product form submission
    productForm.addEventListener("submit", handleProductFormSubmit);

    // Event listener for image input change
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.style.display = "block";
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listener for "Add New Product" button
    addProductBtn.addEventListener("click", () => {
        addProductForm.style.display = "block";
        saveChangesBtn.style.display = "none";
        discardChangesBtn.style.display = "none";
    });

    // Event listener for "Save Changes" button
    saveChangesBtn.addEventListener("click", handleSaveChanges);

    // Event listener for "Discard Changes" button
    discardChangesBtn.addEventListener("click", handleDiscardChanges);

    // Render users from localStorage
    const renderUsers = (users) => {
        userList.innerHTML = ""; // Clear the user list
        users.forEach((user, index) => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.innerHTML = `
                <h2>${user.name}</h2>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role}</p>
                <button class="edit-user" data-index="${index}">Edit</button>
                <button class="delete-user" data-index="${index}">Delete</button>
            `;
            userList.appendChild(userDiv);
        });

        // Add event listeners for delete and edit buttons
        Array.from(document.querySelectorAll(".delete-user")).forEach((button) =>
            button.addEventListener("click", handleDeleteUser)
        );
        Array.from(document.querySelectorAll(".edit-user")).forEach((button) =>
            button.addEventListener("click", handleEditUser)
        );
    };

    // Handle deleting a user
    const handleDeleteUser = (event) => {
        const userIndex = event.target.getAttribute("data-index");
        fetch(`http://localhost:3000/users/${userIndex}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            let users = JSON.parse(localStorage.getItem("users")) || [];
            users.splice(userIndex, 1);
            localStorage.setItem("users", JSON.stringify(users));
            renderUsers(users);
        });
    };

    // Handle editing a user
    const handleEditUser = (event) => {
        editingUserIndex = event.target.getAttribute("data-index");
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const userToEdit = users[editingUserIndex];
        fillUserFormWithData(userToEdit);
        addUserForm.style.display = "block";
        saveUserChangesBtn.style.display = "inline-block";
        discardUserChangesBtn.style.display = "inline-block";
        addUserBtn.style.display = "none";
    };

    // Fill user form with user data
    const fillUserFormWithData = (user) => {
        document.getElementById("user-name").value = user.name;
        document.getElementById("user-email").value = user.email;
        userRoleInput.value = user.role;
    };

    // Handle saving user changes
    const handleSaveUserChanges = () => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUser = {
            name: document.getElementById("user-name").value,
            email: document.getElementById("user-email").value,
            role: userRoleInput.value,
        };

        fetch(`http://localhost:3000/users/${editingUserIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(() => {
            users[editingUserIndex] = updatedUser;
            localStorage.setItem("users", JSON.stringify(users));
            resetUserForm();
            renderUsers(users);
            editingUserIndex = null;
        });
    };

    // Handle discarding user changes
    const handleDiscardUserChanges = () => {
        resetUserForm();
        editingUserIndex = null;
    };

    // Reset the user form and hide elements
    const resetUserForm = () => {
        userForm.reset();
        addUserForm.style.display = "none";
        saveUserChangesBtn.style.display = "none";
        discardUserChangesBtn.style.display = "none";
        addUserBtn.style.display = "inline-block";
    };

    // Handle adding a new user
    const handleUserFormSubmit = (event) => {
        event.preventDefault();
        const newUser = {
            name: document.getElementById("user-name").value,
            email: document.getElementById("user-email").value,
            role: userRoleInput.value,
        };

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (editingUserIndex !== null) {
            fetch(`http://localhost:3000/users/${editingUserIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(response => response.json())
            .then(() => {
                users[editingUserIndex] = newUser;
                editingUserIndex = null;
                localStorage.setItem("users", JSON.stringify(users));
                resetUserForm();
                renderUsers(users);
            });
        } else {
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(response => response.json())
            .then((user) => {
                users.push(user);
                localStorage.setItem("users", JSON.stringify(users));
                resetUserForm();
                renderUsers(users);
            });
        }
    };

    // Event listener for user form submission
    userForm.addEventListener("submit", handleUserFormSubmit);

    // Event listener for "Add New User" button
    addUserBtn.addEventListener("click", () => {
        addUserForm.style.display = "block";
        saveUserChangesBtn.style.display = "none";
        discardUserChangesBtn.style.display = "none";
    });

    // Event listener for "Save User Changes" button
    saveUserChangesBtn.addEventListener("click", handleSaveUserChanges);

    // Event listener for "Discard User Changes" button
    discardUserChangesBtn.addEventListener("click", handleDiscardUserChanges);

    // Initially render products and users
    renderProducts(JSON.parse(localStorage.getItem("products")) || []);
    renderUsers(JSON.parse(localStorage.getItem("users")) || []);
});
