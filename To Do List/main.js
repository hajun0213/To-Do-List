// 기본 DOM 요소
const input = document.getElementById("ToDoText");
const todoList = document.getElementById("todoList");

// Todo 생성
function createTodo(text, completed = false) {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";

    // ✅ 완료 체크박스
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    const todoText = document.createElement("span");
    todoText.textContent = text;

    if (completed) {
        todoItem.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
        todoItem.classList.toggle("completed", checkbox.checked);
        saveTodos(); // 체크 변경 시 저장
    });

    const actions = document.createElement("div");
    actions.className = "actions";

    // ✏️ 수정 버튼
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
        editTodo(todoItem, todoText);
    });

    // ❌ 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
        todoItem.remove();
        saveTodos();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(actions);

    todoList.appendChild(todoItem);
}

// Todo 추가
function PlusToDoList() {
    const text = input.value.trim();
    if (text === "") return;

    createTodo(text);
    saveTodos();

    input.value = "";
}

// Enter 키로 추가
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        PlusToDoList();
    }
});

// Todo 수정
function editTodo(todoItem, todoText) {
    const oldText = todoText.textContent;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = oldText;
    editInput.className = "edit-input";

    todoItem.replaceChild(editInput, todoText);
    editInput.focus();

    function save() {
        const newText = editInput.value.trim();
        todoText.textContent = newText === "" ? oldText : newText;
        todoItem.replaceChild(todoText, editInput);
        saveTodos();
    }

    editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") {
            todoItem.replaceChild(todoText, editInput);
        }
    });

    editInput.addEventListener("blur", save);
}

// 전체 삭제
function DeleteAllItem() {
    todoList.innerHTML = "";
    localStorage.removeItem("todos");
}

// Ctrl + Shift + Backspace 전체 삭제
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === "Backspace") {
        event.preventDefault();
        DeleteAllItem();
    }
});

// localStorage 저장
function saveTodos() {
    const todos = [];

    document.querySelectorAll(".todo-item").forEach(item => {
        const text = item.querySelector("span").textContent;
        const completed = item.querySelector("input[type='checkbox']").checked;

        todos.push({ text, completed });
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

// localStorage 불러오기
function loadTodos() {
    const saved = localStorage.getItem("todos");
    if (!saved) return;

    const todos = JSON.parse(saved);
    todos.forEach(todo => {
        createTodo(todo.text, todo.completed);
    });
}

// 페이지 로드시 자동 복구
window.addEventListener("DOMContentLoaded", loadTodos);


// 로그인 모달 열고 닫기
const loginModal = document.getElementById("loginModal");

const openLoginBtn = document.getElementById("openLogin");
const openSignupBtn = document.getElementById("openSignup");

const closeLoginBtn = document.getElementById("closeLoginModal");
const overlay = document.querySelector(".modal-overlay");

// Sign In 클릭 → 로그인 모달 열기
openLoginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
});

// Sign Up 클릭 → (지금은 로그인 모달 열기)
openSignupBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
});

// X 버튼 클릭 → 닫기
closeLoginBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
});

// 배경 클릭 → 닫기
overlay.addEventListener("click", () => {
    loginModal.classList.add("hidden");
});

// ESC 키 → 닫기
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        loginModal.classList.add("hidden");
    }
});


// 회원가입 모달 제어
const signupModal = document.getElementById("signupModal");
const closeSignupBtn = document.getElementById("closeSignupModal");
const signupOverlay = signupModal.querySelector(".modal-overlay");

// Sign Up 클릭 → 회원가입 모달 열기
openSignupBtn.addEventListener("click", () => {
    closeAllModals();              // ⭐ 항상 초기화
    signupModal.classList.remove("hidden");
});

// X 버튼 → 닫기
closeSignupBtn.addEventListener("click", closeAllModals);

// 로그인 → 회원가입 전환
const loginToSignup = document.querySelector("#loginModal #openSignup");
loginToSignup.addEventListener("click", () => {
    closeAllModals();
    signupModal.classList.remove("hidden");
});

// 회원가입 → 로그인 전환
document.getElementById("goLogin").addEventListener("click", () => {
    closeAllModals();
    loginModal.classList.remove("hidden");
});

// 공통 닫기 함수
function closeAllModals() {
    loginModal.classList.add("hidden");
    signupModal.classList.add("hidden");
}

// overlay 클릭 → 전체 닫기 (각각 1번만)
overlay.addEventListener("click", closeAllModals);
signupOverlay.addEventListener("click", closeAllModals);

// ESC 키 → 전체 닫기
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeAllModals();
    }
});

