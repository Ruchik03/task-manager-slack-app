/**
* The Task Manager Application is build with the help of bolt framework.
* When the user interacts with the application the events are triggered
* and posted here. The server responds to those events as needed. With 
* the help of this application the user can create, delete and commit 
* to tasks as required. The apllication also notifies all the users' 
* when a new task is created by posting a messagae with the information
* of when it's due who created it. 
*
* @author: Ruchik Chaudhari
* Date: 07/20/20
**/


// Require the Bolt package and other necessary tools
const { App } = require("@slack/bolt");
const Datastore = require("nedb");
const { homePage, homeBlock, createTaskBlock } = require("./appHome.js");
const { modal } = require("./modal");
const { createMessageBlock } = require("./appMessage");

const datastore = new Datastore(".z.db");

// Initializes the Bolt app with the bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

//create a task number which will help to keep track of the tasks
let taskNumber = 0;

//load tasks from the data base
loadTasks();

//display the home tab when the event is triggered
viewHomeTab();

/**
 * Receive button action from App Home UI "Add a Task"
 **/
app.action("add_task", async ({ ack, body, context }) => {
  // Acknowledge that the request was recieved
  ack();
  // Open a modal window with forms to be submitted by a user
  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: modal,
    });
  } catch (error) {
    console.error(error);
  }
});

/**
 * Receive view_submissions
 **/
app.view("modal_view", async ({ ack, body, context, view }) => {
  ack();

  //get the task and the date from the modal
  const task = view.state.values.task1.content.value;
  const date = view.state.values.dateBlock.date.selected_date;

  //get the name of the user who created the task
  const userName = body.user.name;

  //create the block for the message
  const message = createMessageBlock(task, date, userName);
  //post it in a specific channel
  const channel_id = "C016FUQULS3";
  //post the message
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: channel_id,
      callback_id: "message_clicked",
      text: "See the task below",
      blocks: message,
    });
  } catch (error) {
    console.error(error);
  }

  //create an object for the task
  const data = {
    task: task,
    date: date,
    taskId: taskNumber,
  };

  //create the block for the new task to show it to users
  createTaskBlock(data, taskNumber);
  //listen to the new button for actions
  updateCommitBtn(taskNumber);
  updateDeleteBtn(taskNumber);
  taskNumber++;

  //add the task to the database
  datastore.insert(data);
  datastore.loadDatabase();
});

//update the view of the home tab after adding tasks
viewHomeTab();

/**
 * Receive button actions from all the commit buttons
 **/
function updateCommitBtn(taskNumber) {
  
  //create a unique id for each commit button
  let commitId = 0;
  let buttonId = "commit_btn" + taskNumber;

  //listen to the each commit button
  app.action(buttonId, async ({ ack, body, context }) => {
    commitId = body.actions[0].action_id;
    console.log("Action commitId = " + commitId);

    ack();
    //get the task number which is on the very end of the button id
    let taskIndex = commitId.slice(10) * 1;

    //update the home page--> Assigned to: ['the user who pressed the commit button']
    commitUpdate(taskIndex, body.user.name);

    try {
      const result = await app.client.views.publish({
        token: context.botToken,
        user_id: body.user.id,
        view: homePage,
      });
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * Receive button actions from all the delete buttons
 **/
function updateDeleteBtn(taskNumber) {
  let deleteId = 0;
  let buttonId = "delete_btn" + taskNumber;

  app.action(buttonId, async ({ ack, body, context }) => {
    //create a unique id for each delete button
    deleteId = body.actions[0].action_id;
    console.log(deleteId);

    ack();
    //get the task number which is on the very end of the button id
    let taskIndex = deleteId.slice(10);
    console.log(taskIndex);
    //remove the specific task with which the delete button was attached
    deleteUpdate(taskIndex);

    try {
      const result = await app.client.views.publish({
        token: context.botToken,
        user_id: body.user.id,
        view: homePage,
      });
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * Update the home page after the commit button was clicked
 **/
function commitUpdate(taskIndex, userName) {
  
  //get a formula to detect the tasks in the homeBlock array
  let index = 3 * taskIndex + 2;
  
  //Change the data of the tasks on the home page
  let taskData = homePage.blocks[index].text.text;
  let newTaskData = taskData.slice(0, taskData.length - 4);
  //add the username who commited to the task
  newTaskData += userName;
  homePage.blocks[index].text.text = "";
  homePage.blocks[index].text.text = newTaskData;
}

/**
 * Update the home page after the delete button was clicked
 **/

function deleteUpdate(taskIndex) {
  //get a formula to detect the tasks in the homeBlock array
  let index = -3 * taskIndex + 11;
  
  //delete the task at that given index
  homePage.blocks.pop(index);
  homePage.blocks.pop(index - 1);
  homePage.blocks.pop(index - 2);
}

/**
 * The functions listens to the events from the Events API and
 * when the  user opens the home tab it displays the hompage 
 * using the data which is provided from here.
 **/
function viewHomeTab() {
  //look for the events from the Events API
  app.event("app_home_opened", async ({ event, context, body }) => {
    try {
      //view.publish is the method that my app uses to push a view to the Home tab
      const result = await app.client.views.publish({
      
        token: context.botToken,
        user_id: event.user,
        view: homePage,
      });
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * The fucntion loads the tasks from the database and if tasks
 * exists then adds those tasks to the home tab
 **/
function loadTasks() {
  //get the data from the database
  datastore.loadDatabase();

  datastore.find({}, (err, data) => {
    let count = 0;
    if (err) {
      return;
    } else {
      //sort it
      data.sort((a, b) => {
        return a.taskId - b.taskId;
      });
      //display each task
      data.forEach(function (task) {
        taskNumber = count;

        createTaskBlock(task, taskNumber);
        // updateButtons(buttons);
        updateCommitBtn(taskNumber);
        updateDeleteBtn(taskNumber);
        count++;
      });
    }
  });
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
