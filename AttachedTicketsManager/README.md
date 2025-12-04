# Attached Tickets Manager

This app allows users to see and manage tickets attached to a problem from the problem ticket's page.


### Set Up the Zendesk App for Development:

* Clone this repo to somewhere on your own computer
* Open terminal
* navigate into the root directory of the project
* run `zcli apps:server`
* then open Zendesk, and add `?zcli_apps=true` to the end of your zendesk url
* open any project and check the apps tab in your right sidebar
* there you will find the zendesk app, which now updates on refresh when you save changes to the code in the project

### Update the Zendesk App:

* Open terminal
* navigate into the root directory of the project
* run `zcli apps:package`
* open your browser
* Navigate to Zendesk Support Apps
* find AttachedTicketManager, and click on the drop down icon
* choose the update option from the dropdown
* click Choose File
* Upload the newly created zip file found in AttachedTicketsManager>tmp
