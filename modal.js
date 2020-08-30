/**
* Modal UI 
**/

const modal ={
	"title": {
		"type": "plain_text",
		"text": "Task Manager ",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Post",
		"emoji": true
	},
	"type": "modal",
  "callback_id":"modal_view",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Please provide the following details:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "divider"
		},
		{
			"type": "input",
      "block_id": "task1",
			"element": {
        "action_id": "content",
				"type": "plain_text_input",
        "placeholder":{
          "type": "plain_text",
					"text": "Write your task..",
        }
			},
			"label": {
				"type": "plain_text",
				"text": "Task:",
				"emoji": true
			}
		},
		{
			"type": "input",
      "block_id": "dateBlock",
			"element": {
        "action_id":"date",
				"type": "datepicker",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a date",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Due Date",
				"emoji": true
			}
		}
	]
};

module.exports = {modal};