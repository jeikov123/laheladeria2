let editingIndex = -1; 

// Cargar usuarios del localStorage y mostrarlos en la página
function loadUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userList = document.getElementById('user-list');

  if (!userList) {
    return;
  }

  userList.innerHTML = '';

  users.forEach((user, index) => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <h3>${user.username}</h3>
      <p>Password: ${user.password}</p>
      <div class="user-card-buttons">
        <button class="edit-btn" data-index="${index}">Editar</button>
        <button class="delete-btn" data-index="${index}">Eliminar</button>
      </div>
    `;
    userList.appendChild(card);
  });
}

// Guardar o modificar un usuario
function saveUser(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (editingIndex !== -1) {
    // Modificar usuario existente
    users[editingIndex].username = username;
    users[editingIndex].password = password;
    alert('Usuario modificado exitosamente');
    editingIndex = -1; // Resetear índice de edición
  } else {
    // Crear nuevo usuario
    users.push({ username, password });
    alert('Usuario creado exitosamente');
  }

  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('user-form').reset();
  loadUsers();
}

// Eliminar un usuario
function deleteUser(index) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.splice(index, 1);
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}

// Editar usuario (cargarlo en el formulario)
function editUser(index) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users[index];

  document.getElementById('username').value = user.username;
  document.getElementById('password').value = user.password;
  editingIndex = index; 
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  loadUsers();

  const userForm = document.getElementById('user-form');
  const userList = document.getElementById('user-list');

  if (userForm) {
    userForm.addEventListener('submit', saveUser);
  }

  if (userList) {
    userList.addEventListener('click', function (event) {
      if (event.target.classList.contains('edit-btn')) {
        const index = event.target.getAttribute('data-index');
        editUser(index);
      }

      if (event.target.classList.contains('delete-btn')) {
        const index = event.target.getAttribute('data-index');
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
          deleteUser(index);
        }
      }
    });
  }
});

// Función para verificar si hay un usuario logueado y actualizar la navegación
function updateNav() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');
  const historialLink = document.getElementById('historial-link');
  const welcomeMessage = document.getElementById('welcome-message');

  if (loggedInUser) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    historialLink.style.display = 'inline';
    welcomeMessage.style.display = 'inline';
    welcomeMessage.textContent = `Bienvenido, ${loggedInUser}`;
    logoutLink.style.display = 'inline';
  } else {
    loginLink.style.display = 'inline';
    registerLink.style.display = 'inline';
    welcomeMessage.style.display = 'none';
    logoutLink.style.display = 'none';
  }
}