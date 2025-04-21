
const list = document.getElementById("list"); /* 할 일 항목을 담을 영역 */
const createBtn = document.getElementById("create-btn"); /* 새로운 todo 추가하기 버튼 */

let todos = []; /* 할 일을 저장하는 배열 */

createBtn.addEventListener('click', createNewTodo); /* 버튼 클릭시 createNewTodo() 실행됨 */
 // addEventListener  => 이벤트 리스너: 어떠한 이벤트가 발생했을 때 함수를 등록.
function createNewTodo() {
	// 새로운 아이템 객체 생성
	const item = {
		id: new Date().getTime(), //1690604133472 특정 년도부터 현재까지의 밀리초
		text: "",
		complete: false
	} /* 할 일 객체 생성. id: 현재시간 기반 고유값, text: 비어있는 문자열(추후 입력), complete: 체크 여부(기본 false) */

	// 배열에 처음에 새로운 아이템을 추가
	todos.unshift(item); /* 최신 todo가 위로 오도록 unshift()를 사용하여 가장 앞에 넣음 */

	// 요소 생성하기
	const { itemEl, inputEl } = createTodoElement(item); /* createTodoElement()로 HTML 요소를 만들고 list에 prepend() */

	// 리스트 요소 안에 방금 생성한 아이템 요소 추가(가장 첫번째 요소로 추가)
	list.prepend(itemEl);

	// disabled 속성 제거
	inputEl.removeAttribute("disabled");
	// input 요소에 focus 
	inputEl.focus(); /* 사용자가 바로 입력할 수 있도록 focus */

	saveToLocalStorage(); /* 로컬 저장소에 저장 */
}

/* <div class="item">
	<input type="checkbox" />
	<input 
		type="text" 
		value="Todo content goes here" 
		disabled />
	<div class="actions">
		<button class="material-icons">edit</button>
		<button class="material-icons remove-btn">remove_circle</button>
	</div>
</div> */ /* 주석 처리된 기존 Todo checkbox */

const toggleBtn = document.getElementById("toggle-darkmode");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // 선택 사항: 로컬스토리지에 저장
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
/* 다크모드 토글 버튼 클릭 시 body에 dark 클래스를 추가하거나 제거함.*/
// 페이지가 로드될 때 저장된 테마 적용
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
});

function createTodoElement(item) { /* item:하나의 todo 항목을 담고 있는 객체 */
	const itemEl = document.createElement("div"); /* todo 항목 요소 생성 함수 */
	itemEl.classList.add("item"); /* 구성 요소들은 체크박스, 텍스트 입력칸, 수정버튼, 삭제버튼이 있다. */

	const checkbox = document.createElement("input"); /* input type="checkbox"생성 */
	checkbox.type = "checkbox";
	checkbox.checked = item.complete; /* 만약 item.complete가 true면 체크되어있음 */

	if (item.complete) {
		itemEl.classList.add("complete");
	} /* 완료된 항목은 부모 div에 complete 클래스를 추가해서 CSS 스타일 적용 가능 */

	const inputEl = document.createElement("input"); /* 텍스트 입력창 만들고 item.test 값을 넣어줌 */
	inputEl.type = "text";
	inputEl.value = item.text;
	inputEl.setAttribute("disabled", ""); /* 처음엔 disabled 상태여서 사용자가 바로 수정은 못하도록 함 */

	const actionsEl = document.createElement("div");
	actionsEl.classList.add("actions");/* 수정 버튼과 삭제 버튼을 담을 div class="actions"생성 */

	const editBtnEl = document.createElement("button"); /* 수정 버튼 생성 */
	editBtnEl.classList.add("material-icons");
	editBtnEl.innerText = "edit";/* material icons를 사용해서 edit 아이콘 표시되게 함 */

	const removeBtnEl = document.createElement("button"); /* 삭제버튼 생성 */
	removeBtnEl.classList.add("material-icons", "remove-btn");
	removeBtnEl.innerText = "remove_circle";/* remove_circle아이콘 표시, remove-btn클래스도 추가하여 스타일링하거나 이벤트 지정 */

	actionsEl.append(editBtnEl); 
	actionsEl.append(removeBtnEl); /* actionsEl에 editBtnEl과 removeBtnEl을 추가 */

	itemEl.append(checkbox);
	itemEl.append(inputEl);
	itemEl.append(actionsEl);/* 각 구성요소(체크박스, 입력창, 버튼박스)를 최종적으로 itmeEl에 넣어서 하나의 todo 항목 DOM을 완성 */

	// EVENTS
	checkbox.addEventListener("change", () => {
		item.complete = checkbox.checked;/* 체크박스 클릭시 change이벤트 발생, 그 상태에 따라 item.complete 값을 true 또는 false로 설정 */

		if (item.complete) {
			itemEl.classList.add("complete"); /* 완료 상태에 따라 complete 클래스를 토글함 */
		} else {
			itemEl.classList.remove("complete");/* CSS에서 스타일을 적용할 때 사용(취소선, 회색 텍스트 등) */
		}

		saveToLocalStorage();/* 변경된 상태를 브라우저 로컬 저장소에 저장함 */
	});

	inputEl.addEventListener("input", () => {
		item.text = inputEl.value;
	});/* input 이벤트에서 텍스트 내용이 바뀔 때마다 item.text에 그 값을 실시간으로 반영  */

	inputEl.addEventListener("blur", () => {
		inputEl.setAttribute("disabled", "");

		saveToLocalStorage();
	});/* 사용자가 텍스트 수정을 마치고 입력창에서 포커스를 잃으면 (blur), 다시 disabled 속성을 주어 수정 못하게 만들고 내용 저장 */

	editBtnEl.addEventListener("click", () => {
		inputEl.removeAttribute("disabled");
		inputEl.focus();
	});/* 수정 버튼 누르면 텍스트 입력 창의 disabled 속성을 제거하고 커서를 자동으로 넣어줌. 바로 수정 가능하게 만듬 */

	removeBtnEl.addEventListener("click", () => {
		todos = todos.filter(t => t.id != item.id);
		itemEl.remove();

		saveToLocalStorage();
	});/* 삭제 버튼을 누르면 todo 배열에서 해당 항목을 제거하고 화면에서 삭제. 변경된 todo 목록을 다시 로컬스토리지에 저장 */

	return { itemEl, inputEl, editBtnEl, removeBtnEl }
} /* todo 요소를 구성하는 DOM 객체들을 외부에서도 사용할 수 있게 반환 */

function displayTodos() {
	loadFromLocalStorage(); /* 로컬 저장소에서 todos 배열을 불러옴 */

	for (let i = 0; i < todos.length; i++) {
		const item = todos[i];

		const { itemEl } = createTodoElement(item);

		list.append(itemEl);
	} /* 불러온 todo 항목들을 하나씩 화면에 표시함 */
}

displayTodos();

function saveToLocalStorage() {
	const data = JSON.stringify(todos);

	localStorage.setItem("my_todos", data);
} /* todos 배열을 JSON 문자열로 변환하여 my_todos라는 키로 저장 */

function loadFromLocalStorage() {
	const data = localStorage.getItem("my_todos");

	if (data) {
		todos = JSON.parse(data);
	}
} /* 저장된 데이터가 있으면 문자열을 다시 객체로 바꿔서 todos에 넣음 */