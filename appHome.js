/**
* Home tab UI
**/


//Store all the UI elements in the homeBlock
const homeBlock = [{
      // Section with text and a button
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Welcome!!* Create your tasks here:"
      },
      accessory: {
        type: "button",
        action_id: "add_task", 
        text: {
          type: "plain_text",
          text: "Add Task"
        }
      }
             
    },
          
    // Horizontal divider line 
    {
      type: "divider"
    }];


const homePage = {
        type: 'home',
        callback_id: 'home_view',
  

        /* body of the view */
        blocks: homeBlock
};

/**
* When there are new tasks added this function makes a task block.
* The created task block is then added to the homeBlock array which
* displays all the tasks on home tab.
**/
function createTaskBlock(taskData,taskNumber){
    
    //create the task block
    let taskBlock = {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Task*: "+taskData.task+"\n*Due*: "+taskData.date+"\n*Assigned To*: none"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://lh3.ggpht.com/yf1Z2e1nCWfxIyHsIa6BrPKQbQRFNKs1ppCO-Q4ddYerciG1L-K9DhvQh6VrMNeGueA",
				"alt_text": "task manager app icon"
			
      }
    };
  
   let buttons = {
			"type": "actions",
      
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Commit",
						"emoji": true
					},
					"value": "commit",
          "style": "primary",
          "action_id": "commit_btn"+taskNumber
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Delete",
						"emoji": true
					},
					"value": "delete_btn",
          "style": "danger",
          "action_id":"delete_btn"+taskNumber
				}
			]
		}
  
   let divider =  {
      type: "divider"
    };
    homeBlock.push(taskBlock, buttons, divider);
}


module.exports = {homePage, homeBlock, createTaskBlock};