const loginForm = document.getElementById('login-form');
const loginComponent = document.getElementById('login-component');
const todoComponent = document.getElementById('todo-component');
const descriptionInput = document.getElementById('descriptionInput');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const logoutBtn = document.getElementById('logout-btn');

let currentUserID = null;
let todoItems = [];
let todoDeleteBtns = [];


axios.defaults.baseURL = 'http://localhost/api'

const createTodo = async (user_id, todo_description) => {
    await  axios.post('/createtodo.php', {
        user_id,
        todo_description,
    })
}

const signIn = async (login,password) => {

    const data = new FormData();
    data.append('login',login);
    data.append('password',password);

    try {
        const response = await axios.post('/signin.php', data);
        if (response.status === 200) {
            loginComponent.classList.toggle('remove');
            todoComponent.classList.toggle('remove');
            currentUserID = response.data.User_Id;
        } else {
            throw Error(response.data.Message);
        }
    }
    catch (error) {
        validationDisplay.innerHTML = error.message;        
    }
}

const singUp = async (username, email, password) => {
    const data = new FormData();
    data.append('username',username);
    data.append('email',email);
    data.append('password',password);

    try {
        const response = await axios.post('/signup.php', data);

        if(response.status === 200) {
            loginComponent.classList.toggle('remove');
            todoComponent.classList.toggle('remove');
        } else {
            throw Error(response.data.Message)
        }

    } catch (error) {
        validationDisplay.innerHTML = error.message
    }
}

const addTodoToDB = async (user_id,todo_description ) => {
    const data = new FormData();
    data.append('user_id', user_id);
    data.append('todo_description', todo_description);

    await axios.post('/createtodo.php', data);
}

function createTodo() {
    const inputText = input.value.trim();
    if (inputText === '') {
        alert('Please enter a valid task');
        return;
    }

    input.value = "";
    todoElementGenerator(inputText);
    todoItemEventListener();
    todoDeleteEventListener();
    save();
}

const todoElement = (inputText, isChecked) => {
    const checkClass = isChecked ? 'checked' : '';
    return `<div class='todo-item flex space-between primary-text'>
                <p class='todo-text ${checkClass}'>${inputText}</p>
                <button class='delete-btn primary-text white-bg'>x</button>
            </div>`;
}

function todoElementGenerator(inputText, isChecked) {

    todoList.innerHTML += todoElement(inputText, isChecked);
}

function todoItemEventListener() {
    const todoItems = document.querySelectorAll('.todo-item');
    for (let i = 0; i < todoItems.length; i++) {
        todoItems[i].addEventListener("click", function () {
            const todoItem = todoItems[i].querySelector('.todo-text');
            todoItem.classList.toggle("checked");
            save();
        })
    }
}

function todoDeleteEventListener() {
    const todoDeleteBtns = document.querySelectorAll('.delete-btn');
    for (let i = 0; i < todoDeleteBtns.length; i++) {
        todoDeleteBtns[i].addEventListener("click", function () {
            const todoToDelete = todoDeleteBtns[i].parentNode;
            todoToDelete.remove();
            save();
        })
    }
}

function save() {
    const todosToSave = [];
    const todosElements = document.querySelectorAll('.todo-text');
    for (let i = 0; i < todosElements.length; i++) {
        const todoToSave = {
            todoText: todosElements[i].textContent,
            isChecked: todosElements[i].classList.contains('checked'),
        };

        todosToSave.push(todoToSave)
    }

    localStorage.setItem('todos', JSON.stringify(todosToSave));
}

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const login = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    signIn(login,password);

});

addBtn.addEventListener('click', addTodoToDB);

logoutBtn.addEventListener('click', function () {
    loginComponent.classList.toggle('remove');
    todoComponent.classList.toggle('remove');
    currentUserID = null;
})