/*
Required Features 🎯
[ ] User can add a todo.
[ ] User can remove a todo.
[ ] User can mark a todo done.
[ ] User can see a list of their todos.
*/

//Prompt the user to enter his/her username
let Username = prompt("Please enter your name:")
//Keep asking ultil user enters something
while (Username === ''){
  Username = prompt('Please enter your name:')
}

//Get the data from local storage with given username
let todoList = JSON.parse(localStorage.getItem(Username)) || []

//Necessary variables
let is_clicked = false
let whichFrame = 'all'

//display the previously save to-do list of given user
displayHTML(['undone','done'], whichFrame)


//Click Event for Add BTN to add new task object
document.getElementById('dn-add').addEventListener('click', function (evt) {
  let input = document.getElementById('dn-input-text').value
  if (input === '') {
    return
  }

  //Count the number of start
  let stars = parseInt(document.getElementById('dn-priority').value)

  //Create a todo item object
  let itemTodo = { 'content': input, 'complete': 'undone', 'class': 'dn-undoneTask', 'is_clicked': false, 'priority': stars ,finishTime:''}

  //Add item to the to-do list
  todoList.push(itemTodo)

  //Sort the array based on priority
  todoList = todoList.sort((a, b) => {
    return b['priority'] - a['priority']
  })

  //Display the todoList with the current frame
  displayFrame()
  updateBtn()
  updateLocalStorage(todoList, Username)
})

//Click Event for All button
document.getElementById('dn-all').addEventListener('click', function () { displayHTML(['undone', 'done'], 'all') })

//Click Event for Done button
document.getElementById('dn-done').addEventListener('click', function () { displayHTML(['done'], 'done') })

//Click Event for Undone button
document.getElementById('dn-undone').addEventListener('click', function () { displayHTML(['undone'], 'undone') })

//Function to display the current frame
function displayFrame() {
  switch (whichFrame) {
    case 'all':
      displayHTML(['undone', 'done'], 'all')
      break
    case 'done':
      displayHTML(['done'], 'done')
      break
    case 'undone':
      displayHTML(['undone'], 'undone')
      break
  }
}

//Function to display tasks that are either done or undone
function displayHTML(completion, frame) {
  //Update the current frame
  whichFrame = frame

  //Create a list with elements that equals to completion
  let newList = todoList.filter((item) => completion.includes(item['complete']))

  //Construct a string of html tag with its attributes
  let todoHTML = newList.reduce((total, item, index) => {
    //Create a new button to set as Done
    let setDone = `<button onclick="clickTask(${index})" class='btn btn-outline-light btn-sm dn-btn-task'>Done</button>`

    //Create a new button to remove it
    let removeBtn = `<button onclick='removeTask(${index})' class='btn btn-outline-light btn-sm dn-btn-task'>Remove</button>`

    //Create a new paragraph to add text
    let para = `<a id='task-${index}' class=${item.class} href='#'>To do: ${item.content}</a>`

    //Create a number of stars
    let icons = ''
    for (let i = 0; i < item['priority']; i++) {
      icons += `<i class="far fa-star" id='dn-star'></i>`
    }

    //Add up everything to todoHTML tag
    return total += `<div class="todoLists">${para}${icons}${setDone}${removeBtn}</div>`
  }, '')

  //Display all tasks of the list to UI 
  document.getElementById('dn-display-list').innerHTML = todoHTML

  //
}

//Function to switch a task as done or undone.
function clickTask(index) {
  if (!todoList[index]['is_clicked']) {
    //Set the task as done by updating task's attribute
    todoList[index]['complete'] = 'done'
    todoList[index]['class'] = 'dn-doneTask'

    //Set attribute for tag that holds the task
    document.getElementById(`task-${index}`).setAttribute('class', 'dn-doneTask')

    //If the click is not turned on, turn it on
    todoList[index]['is_clicked'] = true
  } else {
    //Set the task as undone
    todoList[index]['complete'] = 'undone'
    todoList[index]['class'] = 'dn-undoneTask'

    //Set attribute for tag that holds the task
    document.getElementById(`task-${index}`).setAttribute('class', 'dn-undoneTask')

    //If the click is turned on, turn it off
    todoList[index]['is_clicked'] = false
  }

  //Update the button and todoList
  updateBtn()
  updateLocalStorage(todoList, Username)
}

//Function to remove a task at given index
function removeTask(index) {
  todoList.splice(index, 1)
  displayFrame()
  updateBtn()
  updateLocalStorage(todoList, Username)
}

//Function to update button
function updateBtn() {
  //If the todoList is empty, return right away
  if (todoList === null) {
    return;
  }

  //Calculate the number of all tasks
  let all = todoList.length;

  console.log(todoList)

  //Calculate the number of elements that are marked done
  let done = todoList.filter((item) => item['complete'] === 'done').length

  //Calculate the number of elements that are marked undone
  let undone = todoList.filter((item) => item['complete'] === 'undone').length

  //Update the UI
  document.getElementById('dn-number-all').innerText = all
  document.getElementById('dn-number-undone').innerText = undone
  document.getElementById('dn-number-done').innerText = done
}

//Function to update the current local storage of given user
function updateLocalStorage(newtodoList, username){
  localStorage.setItem(username, JSON.stringify(newtodoList))
}

/*
Note:
1. Icon acts as text
2. Know how to use Localstorage to save it permanently
3. update button is the same as updating the to-do list. Thus, updateBtn() always goes with updateLocalStorage()
4. Open console -> Find Application -> FInd localStorage
*/