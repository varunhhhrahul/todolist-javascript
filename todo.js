// let todos = [];
const fs = require('fs');
const TODO_PATH = `${process.cwd()}/todo.txt`;
const DONE_PATH = `${process.cwd()}/done.txt`;

function init() {
  //create file if it's not present present.
  if (!fs.existsSync(TODO_PATH)) {
    setData([]);
  }
  if (!fs.existsSync(DONE_PATH)) {
    // setDoneData('');
  }
}

function getData() {
  //read file for its contents
  var contents = fs.readFileSync(TODO_PATH);

  //parse contents
  var data = JSON.parse(contents);
  return data;
}

function setData(data) {
  //strigify JSON
  var dataString = JSON.stringify(data);

  //write to  file
  fs.writeFileSync(TODO_PATH, dataString);
}

function setDoneData(data) {
  var dataString = data === undefined ? '' : data;
  // write to file
  fs.appendFileSync(DONE_PATH, `${dataString}\n`);
}

const addTodo = (todo) => {
  const todos = getData();
  const index = todos.length + 1;
  if (!todo) {
    console.log('Error: Missing todo string. Nothing added!');
  } else {
    todos.push({ index, text: todo, completed: false, dateOfCompletion: null });
    setData(todos);
    console.log(`Added todo: "${todo}"`);
  }
};

const addDoneTodo = (todo) => {
  if (!todo) {
    console.log('Some Error Occurred!');
  } else {
    setDoneData(`x ${todo.dateOfCompletion} ${todo.text}`);
  }
};

const showRemainingTodos = () => {
  let todos = getData();
  if (todos.length === 0) {
    console.log('There are no pending todos!');
  } else {
    todos = todos.filter((todo) => todo.completed === false);
    for (let i = todos.length - 1; i >= 0; i--) {
      if (todos[i].completed === false) {
        console.log(`[${i + 1}] ${todos[i].text}`);
      }
    }
  }
};

const deleteTodo = (index, num = 1) => {
  let todos = getData();
  let todo = todos.find((todo) => todo.index === index);
  if (!todo) {
    console.log(`Error: todo #${index} does not exist. Nothing deleted.`);
  } else {
    todos = todos.filter((todo) => todo.index !== index);

    for (let i = todos.length - 1; i >= 0; i--) {
      todos[i].index = i + 1;
    }
    setData(todos);
    if (num === 1) {
      console.log(`Deleted todo #${index}\n`);
    }
  }
};

const completeTodo = (index) => {
  const todos = getData();
  const todo = todos.find((todo) => todo.index === index);
  if (!todo) {
    console.log(`Error: todo #${index} does not exist.`);
  } else {
    todos[index - 1].completed = true;
    todos[index - 1].dateOfCompletion = `${new Date()
      .toISOString()
      .slice(0, 10)}`;

    console.log(`Marked todo #${index} as done.`);
  }
  setData(todos);
  addDoneTodo(todos[index - 1]);
  // deleteTodo(index, 2);
};

const showHelp = () => {
  console.log(`Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`);
};

const countPendingTodos = () => {
  let count = 0;
  const todos = getData();
  for (let todo of todos) {
    if (!todo.completed) {
      count++;
    }
  }
  return count;
};

const countCompletedTodos = () => {
  let count = 0;
  const todos = getData();
  for (let todo of todos) {
    if (todo.completed) {
      count++;
    }
  }
  return count;
};

const showReport = () => {
  console.log(
    `${new Date()
      .toISOString()
      .slice(
        0,
        10
      )} Pending : ${countPendingTodos()} Completed : ${countCompletedTodos()}`
  );
};

const argument = process.argv[2];
const details = process.argv[3];
init();

switch (argument) {
  case 'add': {
    if (details === undefined) {
      console.log('Error: Missing todo string. Nothing added!');
      break;
    } else {
      const todo = details.replace(/"/g, '');
      addTodo(todo);
      break;
    }
  }
  case 'ls':
    showRemainingTodos();
    break;
  case 'del':
    if (details === undefined) {
      console.log('Error: Missing NUMBER for deleting todo.');
      break;
    } else {
      deleteTodo(Number(details));
      break;
    }
  case 'done':
    if (details === undefined) {
      console.log('Error: Missing NUMBER for marking todo as done.');
      break;
    } else {
      completeTodo(Number(details));
      break;
    }
  case 'help':
    showHelp();
    break;
  case 'report':
    showReport();
    break;
  default:
    showHelp();
    break;
}
