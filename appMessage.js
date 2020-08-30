/**
* Message UI
**/

//Create a message block with the task, date and username
function createMessageBlock(task, date, userName){
  
  let messageBlock = [
        {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "A task has been created:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
        "type": "plain_text",
				"text": "Task: "+task+"\nDue: "+date+"\nCreated By: "+userName,
				"emoji": true
			}
		},
		{
			"type": "divider"
		}
      ];
  return messageBlock;
}


module.exports={createMessageBlock};