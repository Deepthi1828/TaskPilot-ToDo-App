// script.js

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let tasks = [];

/* ========================= */
/* LOAD TASKS */
/* ========================= */

function loadTasks(){

    const storedTasks =
    JSON.parse(localStorage.getItem("tasks"));

    if(storedTasks){

        tasks = storedTasks;
    }

    renderTasks();
}

loadTasks();

/* ========================= */
/* ADD TASK */
/* ========================= */

function addTask(){

    if(taskInput.value.trim() === ""){

        alert("Please enter a task");
        return;
    }

    const task = {

        text: taskInput.value,
        priority: priority.value,
        date: dueDate.value,
        completed:false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    /* RESET INPUTS */

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "high";
}

/* ========================= */
/* RENDER TASKS */
/* ========================= */

function renderTasks(filteredTasks = tasks){

    taskList.innerHTML = "";

    filteredTasks.forEach((task,index)=>{

        const div = document.createElement("div");

        div.classList.add("task");
        div.classList.add(task.priority);

        if(task.completed){

            div.classList.add("completed");
        }

        div.innerHTML = `

        <div class="task-left">

            <div class="task-title">
                ${task.text}
            </div>

            <div class="task-date">
                ${task.date ? "Due : " + task.date : "No Due Date"}
            </div>

        </div>

        <div class="task-actions">

            <button class="icon-btn complete-btn"
            onclick="toggleComplete(${index})">

            <i class="fa-solid fa-check"></i>

            </button>

            <button class="icon-btn delete-btn"
            onclick="deleteTask(${index})">

            <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        taskList.appendChild(div);

    });

    updateProgress();
}

/* ========================= */
/* COMPLETE TASK */
/* ========================= */

function toggleComplete(index){

    tasks[index].completed =
    !tasks[index].completed;

    saveTasks();

    const activeFilter =
    document.querySelector(".filter-btn.active")
    .innerText.toLowerCase();

    filterTasks(activeFilter);
}

/* ========================= */
/* DELETE TASK */
/* ========================= */

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    const activeFilter =
    document.querySelector(".filter-btn.active")
    .innerText.toLowerCase();

    filterTasks(activeFilter);
}

/* ========================= */
/* SAVE TASKS */
/* ========================= */

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* ========================= */
/* SEARCH TASKS */
/* ========================= */

searchInput.addEventListener("keyup",()=>{

    const value =
    searchInput.value.toLowerCase();

    const filtered = tasks.filter(task =>

        task.text.toLowerCase()
        .includes(value)

    );

    renderTasks(filtered);
});

/* ========================= */
/* FILTER TASKS */
/* ========================= */

function filterTasks(type){

    document.querySelectorAll(".filter-btn")
    .forEach(btn =>

        btn.classList.remove("active")
    );

    const buttons =
    document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => {

        if(
            btn.innerText.toLowerCase() === type
        ){

            btn.classList.add("active");
        }
    });

    if(type === "completed"){

        const completedTasks =
        tasks.filter(task => task.completed);

        renderTasks(completedTasks);
    }

    else if(type === "pending"){

        const pendingTasks =
        tasks.filter(task => !task.completed);

        renderTasks(pendingTasks);
    }

    else{

        renderTasks(tasks);
    }
}

/* ========================= */
/* UPDATE PROGRESS */
/* ========================= */

function updateProgress(){

    const completedTasks =
    tasks.filter(task => task.completed).length;

    const totalTasks = tasks.length;

    const percentage = totalTasks === 0
    ? 0
    : (completedTasks / totalTasks) * 100;

    progress.style.width =
    `${percentage}%`;

    progressText.innerHTML =
    `Progress : ${Math.round(percentage)}%`;
}

/* ========================= */
/* DARK / LIGHT MODE */
/* ========================= */

themeToggle.addEventListener("click",()=>{

    document.body.classList
    .toggle("light-mode");

    if(
        document.body.classList
        .contains("light-mode")
    ){

        themeToggle.innerHTML =
        `<i class="fa-solid fa-sun"></i>`;
    }

    else{

        themeToggle.innerHTML =
        `<i class="fa-solid fa-moon"></i>`;
    }
});