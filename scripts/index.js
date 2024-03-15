const loginForm = document.getElementById('login-form');
const loginComponent = document.getElementById('login-component');
const validationDisplaySignIn = document.getElementById('validationDisplaySignIn');
const registerLink = document.getElementById('register-link');
const loginInput = document.getElementById('login');
const loginPasswordInput = document.getElementById('password');

const registerForm = document.getElementById('register-form');
const registerComponent = document.getElementById('register-component');
const validationDisplaySignUp = document.getElementById('validationDisplaySignUp');
const loginLink = document.getElementById('login-link');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const registerPasswordInput = document.getElementById('register-password');

const todoComponent = document.getElementById('todo-component');
const descriptionInput = document.getElementById('descriptionInput');
const validationInputDisplay = document.getElementById('input-validation');
const todoText = document.getElementById('todo-text');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const logoutBtn = document.getElementById('logout-btn');
const scoreDisplay = document.getElementById('score-display');

let currentUserID = null;
let currentUserScore = null;
let currentTaskSelectedId = null;

axios.defaults.baseURL = 'http://localhost/api';

const createTodo = async (user_id, todo_description) => {
  const data = new FormData();
  data.append('user_id', user_id);
  data.append('todo_description', todo_description);

  await axios.post('/createtodo.php', data);
  populateTodos(currentUserID);
};

const deleteTodo = async (todo_id) => {
  const data = new FormData();
  data.append('todo_id', todo_id);

  const response = await axios.post('/deletetodo.php', data);
  currentUserScore = response.data.Score;
  populateTodos(currentUserID);
};

const updateTodo = async (todo_id, todo_description) => {
  if (todo_description) {
    const data = new FormData();
    data.append('todo_id', todo_id);
    data.append('todo_description', todo_description);
    await axios.post('/updatetodo.php', data);
  }
  populateTodos(currentUserID);
};

const signIn = async (login, password) => {
  const data = new FormData();
  data.append('login', login);
  data.append('password', password);
  try {
    const response = await axios.post('/signin.php', data);
    if (response.data.LoggedIn) {
      loginComponent.classList.toggle('remove');
      adjustOnLogin(response);
    } else {
      throw Error(response.data.Message);
    }
  } catch (error) {
    validationDisplaySignIn.innerHTML = error.message;
  }
};

const signUp = async (username, email, password) => {
  const data = new FormData();
  data.append('username', username);
  data.append('email', email);
  data.append('password', password);

  try {
    const response = await axios.post('/signup.php', data);

    if (response.data.Registered) {
      registerComponent.classList.toggle('remove');
      adjustOnLogin(response);
    } else {
      throw Error(response.data.Message);
    }
  } catch (error) {
    validationDisplaySignUp.innerHTML = error.message;
  }
};

const getTodos = async (user_id) => {
  try {
    const response = await axios.get(`/gettodos.php?user_id=${user_id}`);
    return response.data.Todos;
  } catch (error) {
    throw Error(error.response.data.Message);
  }
};

const adjustOnLogin = (response) => {
  todoComponent.classList.toggle('remove');
  currentUserID = response.data.User_Id;
  currentUserScore = response.data.Score;
  saveUserIdLocally(currentUserID);
  populateTodos(currentUserID);
  clearForms();
};

const toggleTodoStatus = async (user_id, todo_id, is_checked) => {
  const data = new FormData();
  data.append('user_id', user_id);
  data.append('todo_id', todo_id);
  data.append('is_checked', is_checked);

  try {
    const response = await axios.post('/toggletodo.php', data);
    currentUserScore = response.data.Score;
    if (currentUserScore !== null && currentUserScore !== undefined) {
      adjustScore(currentUserScore);
    }
  } catch (error) {
    console.log(error);
  }
};

const addTodo = () => {
  try {
    const description = descriptionInput.value.trim();
    if (description === '' && !currentTaskSelectedId) {
      throw Error('Please enter a valid task');
    }

    if (currentTaskSelectedId) {
      updateTodo(currentTaskSelectedId, description);
    } else {
      createTodo(currentUserID, description);
    }
  } catch (error) {
    validationInputDisplay.innerText = error.message;
  }
};

const populateTodos = async () => {
  adjustScore(currentUserScore);
  currentTaskSelectedId = null;
  validationInputDisplay.innerText = '';
  descriptionInput.value = '';
  todoList.innerHTML = '';
  addBtn.innerHTML = 'Add';
  const todos = await getTodos(currentUserID);
  if (!todos) {
    return;
  }
  todos.forEach((todo) => {
    const { id, description, complete } = todo;
    generateTodo(id, description, complete);
  });
  todoItemEventListener();
  todoTextEventListener();
  todoDeleteEventListener();
};

const generateTodo = (id, description, complete) => {
  todoList.innerHTML += todoElement(id, description, complete);
};

const todoElement = (id, description, complete) => {
  const checkClass = complete ? 'checked' : '';
  return `<div class="todo-item flex space-between primary-text">
                <p class="todo-text ${checkClass}" data-todo-id="${id}">${description}</p>
                <button class="delete-btn primary-text white-bg" data-todo-id="${id}">X</button>
            </div>`;
};

const todoItemEventListener = () => {
  const todoItems = document.querySelectorAll('.todo-item');
  for (let i = 0; i < todoItems.length; i++) {
    todoItems[i].addEventListener('click', (event) => {
      const todoItem = todoItems[i].querySelector('.todo-text');
      const todo_id = event.target.closest('.todo-item').querySelector('.delete-btn').getAttribute('data-todo-id');
      let is_checked = false;
      if (todoItem.classList.contains('checked')) {
        is_checked = false;
        todoItem.classList.remove('checked');
        toggleTodoStatus(currentUserID, todo_id, is_checked);
      } else {
        is_checked = true;
        todoItem.classList.add('checked');
        toggleTodoStatus(currentUserID, todo_id, is_checked);
      }
    });
  }
};

const todoDeleteEventListener = () => {
  const todoDeleteBtns = document.querySelectorAll('.delete-btn');
  for (let i = 0; i < todoDeleteBtns.length; i++) {
    todoDeleteBtns[i].addEventListener('click', (event) => {
      event.stopPropagation();
      const todo_id = event.target.getAttribute('data-todo-id');
      deleteTodo(todo_id);
    });
  }
};

const todoTextEventListener = () => {
  const todoTexts = document.querySelectorAll('.todo-text');
  todoTexts.forEach((todoText) => {
    todoText.addEventListener('click', (event) => {
      event.stopPropagation();
      currentTaskSelectedId = todoText.getAttribute('data-todo-id');
      descriptionInput.value = todoText.innerHTML;
      addBtn.innerHTML = 'Edit';
    });
  });
};

const adjustScore = (score) => {
  if (!score) {
    score = 0;
  }
  scoreDisplay.innerHTML = score;
  saveScoreLocally(score);
};

const clearForms = () => {
  loginInput.value = '';
  loginPasswordInput.value = '';
  emailInput.value = '';
  usernameInput.value = '';
  registerPasswordInput.value = '';
};

const saveScoreLocally = (score) => {
  localStorage.setItem('currentUserScore', JSON.stringify(score));
};

const saveUserIdLocally = (id) => {
  localStorage.setItem('currentUser', JSON.stringify(id));
};

const checkCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser')) || null;
};

const currentUserStored = checkCurrentUser();

if (currentUserStored) {
  currentUserID = currentUserStored;
  currentUserScore = JSON.parse(localStorage.getItem('currentUserScore')) || 0;
  loginComponent.classList.toggle('remove');
  todoComponent.classList.toggle('remove');
  populateTodos(currentUserID);
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const login = loginInput.value;
  const password = loginPasswordInput.value;
  signIn(login, password);
});

registerLink.addEventListener('click', () => {
  loginComponent.classList.toggle('remove');
  registerComponent.classList.toggle('remove');
});

loginLink.addEventListener('click', () => {
  loginComponent.classList.toggle('remove');
  registerComponent.classList.toggle('remove');
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = registerPasswordInput.value;
  signUp(username, email, password);
});

addBtn.addEventListener('click', addTodo);
descriptionInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

logoutBtn.addEventListener('click', () => {
  loginComponent.classList.toggle('remove');
  todoComponent.classList.toggle('remove');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentUserScore');
});
