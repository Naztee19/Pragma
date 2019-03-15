
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
	todo: [],
	completed: []
};


var hamburger =	 document.getElementById("hamburger"),
	menu =	 document.getElementById("menu"),
	openTaskWrapperButton = document.getElementById("open-task-wrapper-button"),
	newTaskWrapper = document.getElementById("new-task-wrapper"),
	addTaskButton = document.getElementById("add-task-button"),
	editTaskButton = document.getElementById("edit-task-button");

//SVG Icons
var addSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M256,0c-11.422,0-20.682,9.26-20.682,20.682v470.636c0,11.423,9.26,20.682,20.682,20.682c11.423,0,20.682-9.259,20.682-20.682V20.682C276.682,9.26,267.423,0,256,0z"/></g></g><g><g><path d="M491.318,235.318H20.682C9.26,235.318,0,244.578,0,256c0,11.423,9.26,20.682,20.682,20.682h470.636c11.423,0,20.682-9.259,20.682-20.682C512,244.578,502.741,235.318,491.318,235.318z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
	editSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 528.899 528.899;"xml:space="preserve"><g><path class="fill" d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611C532.495,100.753,532.495,77.559,518.113,63.177zM0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069L27.473,390.597L0.3,512.69z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>', 
	completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g class="fill"><path d="M468.907,214.604c-11.423,0-20.682,9.26-20.682,20.682v20.831c-0.031,54.338-21.221,105.412-59.666,143.812c-38.417,38.372-89.467,59.5-143.761,59.5c-0.04,0-0.08,0-0.12,0C132.506,459.365,41.3,368.056,41.364,255.883c0.031-54.337,21.221-105.411,59.667-143.813c38.417-38.372,89.468-59.5,143.761-59.5c0.04,0,0.08,0,0.12,0c28.672,0.016,56.49,5.942,82.68,17.611c10.436,4.65,22.659-0.041,27.309-10.474c4.648-10.433-0.04-22.659-10.474-27.309c-31.516-14.043-64.989-21.173-99.492-21.192c-0.052,0-0.092,0-0.144,0c-65.329,0-126.767,25.428-172.993,71.6C25.536,129.014,0.038,190.473,0,255.861c-0.037,65.386,25.389,126.874,71.599,173.136c46.21,46.262,107.668,71.76,173.055,71.798c0.051,0,0.092,0,0.144,0c65.329,0,126.767-25.427,172.993-71.6c46.262-46.209,71.76-107.668,71.798-173.066v-20.842C489.589,223.864,480.33,214.604,468.907,214.604z"/></g></g><g><g class="check-fill"><path d="M505.942,39.803c-8.077-8.076-21.172-8.076-29.249,0L244.794,271.701l-52.609-52.609c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.077-8.077,21.172,0,29.249l67.234,67.234c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.586-2.019,14.625-6.058L505.942,69.052C514.019,60.975,514.019,47.88,505.942,39.803z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>',
	removeSVG = '<svg version="1.1" class="fill" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';

renderToDos();
checkPerc();

hamburger.addEventListener('click', function(event) {

	hamburger.classList.toggle("change");

	/*if (menu.style.display == 'block') {
		menu.style.display = 'none';
	} else {
		menu.style.display = 'flex';
	}*/

}, false);

function calcPercentage(partialValue, totalValue) {
   return (100 * partialValue) / totalValue;
} 

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function checkPerc() {

	var totalToDos = data.todo.length;
	var totalCompleted = data.completed.length;
	var totalTasks = totalToDos + totalCompleted;

	document.getElementById('perc-to-do').innerText = (round(calcPercentage(totalToDos, totalTasks)) || 0) + "%";
	document.getElementById('perc-completed').innerText = (round(calcPercentage(totalCompleted, totalTasks)) || 0) + "%";
}

openTaskWrapperButton.addEventListener('click', function(event) {

	if (newTaskWrapper.style.display == 'flex') {
		openTaskWrapperButton.classList.remove("rotateBy45");
		newTaskWrapper.style.display = 'none';
	} else {
		openTaskWrapperButton.classList.add("rotateBy45");
		newTaskWrapper.style.display = 'flex';
	}

}, false);

addTaskButton.addEventListener('click', function(event) {

	var taskName = document.getElementById('new-task').value;

	if(taskName){
		addItem(taskName);
  	}

}, false);

editTaskButton.addEventListener('click', function(newValue) {

	var taskName = document.getElementById('new-task').value;

	if(taskName){
		data.todo.push(newValue);
		dataUpdated();		
  	}

}, false);

document.getElementById('new-task').addEventListener('keydown', function (e) {
	var value = this.value;

	if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value) {
		addItem(value);
	}
});

function addItem (value) {
	addTaskToDo(value);
	document.getElementById('new-task').value = '';

	data.todo.push(value);

	dataUpdated();
}

function renderToDos() {
	if(!data.todo.length && !data.completed.length) {
		return;
	}

	for(var i=0; i < data.todo.length; i++) {
		var value = data.todo[i];
		addTaskToDo(value);

	}

	for(var j=0; j < data.completed.length; j++) {
		var value = data.completed[j];
		addTaskToDo(value, true);
	}	
}

function dataUpdated() {
	console.log(data);

	localStorage.setItem('todoList', JSON.stringify(data));

	checkPerc();
}

function removeItem() {
	var item = this.parentNode.parentNode;
	var parent = item.parentNode;	
	var id = parent.id;
	var value = item.innerText;

	if(id === 'todo'){
		data.todo.splice(data.todo.indexOf(value), 1);

	} else {
		data.completed.splice(data.completed.indexOf(value), 1);
	}

	dataUpdated();

	parent.removeChild(item);

}

function completeItem() {
	var item = this.parentNode.parentNode;
	var parent = item.parentNode;
	var id = parent.id;
	var value = item.innerText;

	if(id ==='todo'){
		data.todo.splice(data.todo.indexOf(value), 1);
		data.completed.push(value);

	} else {
		data.completed.splice(data.completed.indexOf(value), 1);
		data.todo.push(value);
	}
	
	dataUpdated();

	var target = (id === 'todo') ? document.getElementById('completed'):document.getElementById('todo');
	
	parent.removeChild(item);
	target.insertBefore(item, target.childNodes[0]);
}


function addTaskToDo(text, completed) {

	var list = (completed) ? document.getElementById('completed'):document.getElementById('todo');

	var item = document.createElement('li');
	var span = document.createElement('span');
	item.appendChild(span);
	span.innerText = text;

	var actionBar = document.createElement('div');
	actionBar.classList.add('action-bar');

	var edit = document.createElement('div');
	edit.classList.add('edit');
	edit.innerHTML = editSVG;

	var complete = document.createElement('div');
	complete.classList.add('complete');
	complete.innerHTML = completeSVG;

	complete.addEventListener('click', completeItem);

	var remove = document.createElement('div');
	remove.classList.add('delete');
	remove.innerHTML = removeSVG;

	remove.addEventListener('click', removeItem);

	actionBar.appendChild(edit);
	actionBar.appendChild(complete);
	actionBar.appendChild(remove);
	item.appendChild(actionBar);

	list.insertBefore(item, list.childNodes[0]);

}