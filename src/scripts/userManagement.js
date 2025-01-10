// Elements
const saveUserBtn = document.getElementById("save-user");
const userNameInput = document.getElementById("user-name");
const userEmailInput = document.getElementById("user-email");
const userRoleInput = document.getElementById("user-role");
const userList = document.getElementById("user-list");

let editingUserIndex = null;

// Fetch users from localStorage and render
const renderUsers = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
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

  // Add event listeners to edit and delete buttons
  Array.from(document.querySelectorAll(".edit-user")).forEach((button) =>
    button.addEventListener("click", handleEditUser)
  );
  Array.from(document.querySelectorAll(".delete-user")).forEach((button) =>
    button.addEventListener("click", handleDeleteUser)
  );
};

// Save or update user in localStorage
const handleSaveUser = () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Prepare the new or updated user data
  const newUser = {
    name: userNameInput.value,
    email: userEmailInput.value,
    role: userRoleInput.value,
  };

  // If we're editing a user, update their data; otherwise, add a new one
  if (editingUserIndex !== null) {
    users[editingUserIndex] = newUser;
    editingUserIndex = null; // Reset editing state
  } else {
    users.push(newUser);
  }

  // Save the users list to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Clear form and re-render users
  resetForm();
  renderUsers();
};

// Handle editing a user
const handleEditUser = (event) => {
  editingUserIndex = event.target.dataset.index;
  const users = JSON.parse(localStorage.getItem("users"));
  const user = users[editingUserIndex];

  // Pre-fill the form with the user's current data
  userNameInput.value = user.name;
  userEmailInput.value = user.email;
  userRoleInput.value = user.role;
};

// Handle deleting a user
const handleDeleteUser = (event) => {
  const userIndex = event.target.dataset.index;
  let users = JSON.parse(localStorage.getItem("users"));
  users.splice(userIndex, 1); // Remove the user

  // Save the updated list of users
  localStorage.setItem("users", JSON.stringify(users));

  // Re-render users
  renderUsers();
};

// Reset the form for adding a new user
const resetForm = () => {
  userNameInput.value = "";
  userEmailInput.value = "";
  userRoleInput.value = "admin";
};

// Event listener for the save button
saveUserBtn.addEventListener("click", handleSaveUser);

// Initial render of users when the page loads
renderUsers();
