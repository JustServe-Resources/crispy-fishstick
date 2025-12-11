# Generic Ticket View

## Description
This is a zendesk app that automatically fills out various ticket forms to speed up ticket resolution in Zendesk.


### Dependencies

- [Node.js](https://nodejs.org/en/) >= 18.12.1


### Setup

1. Clone or fork this repo
2. navigate to the root directory of the cloned repo
3. create a file called ".env.development"
4. inside the newly created file, add an environment variable `NODE_ENV='development'` this tells the app it needs to take care of mounting the app itself
5. Run `npm install`
6. run `npm start`, this launches a developer server which can be accessed through zendesk by adding `?zcli_apps=true` to the end of the url


