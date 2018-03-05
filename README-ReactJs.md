# App Clone - Facebook

A Facebook clone app using Python Flask and React JS

# Front-end

We will use Create-react-app along with the Ant Design framework to build our app. Ensure that you have Node installed on your computer, do this by running `node-v` in the terminal. If you do not have Node installed you can get it from https://nodejs.org

# Frontend Features Implemented
1.UI has been implemted for login and signup page using React JS( UI Microservice - https://ui.compete25.hasura-app.io/). 

2.The login page expects user to enter a username(mail/mobile) and password of atleast 8 characters length. If the user has not been registered, then he can signup in the signup page.

3.The UI sends the login or signup request to backend in json format and gets response back from the backend, then alerts the user whether login is successful or not.

4. The UI sends fb post requests containing status and media files in post.

# Back-end
Back-end has been done using Python-Flask which takes care of signup,login, post and logout requests from the UI of frontend. The Backend also does the verfication part of different requests from UI.

# Backend Features Implemented
1. Backend has been implemented using Python Flask(App microservice - https://app.begun51.hasura-app.io/)
2. The UI requests for login and signup are handled by the backend.
3. For login or signup requests, the Backend checks whether the given username is email or mobile. If the given email or mobile number is invalid, then an invalid response is sent back. If valid email or mobile was given, then based on the type of username(email or  mobile) the post requests are made to the Auth Api of Hasura. The response from the Auth Api is forwarded to the Frontend UI.
3. For post requests, the data is stored in hasura using Data API- the staus description is stored in status table and the media files are stored using hasura file api. Finally in the post tables a record is created where hasura id of user, status id, file id are stored.
4. For logout requests, the logout request is made to the hasura api. 

# Hasura APIs used
1. DATA API
2. AUTH API
3. FILE API
4. NOTIFY API 

# Prerequisites

- [Hasura CLI](https://docs.hasura.io/0.15/manual/install-hasura-cli.html)
- [Git](https://git-scm.com)
- [Python 3](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installing/) (required only for local development)

# Deployment instructions
Basic deployment:

Install Hasura CLI.
$ hasura login
clone and cd into it.
$ git add . && git commit -m "Initial Commit"
$ git push hasura master Now, your app will be running at https://ui.YOUR-CLUSTER-NAME.hasura-app.io (replace YOUR-CLUSTER-NAME with the name of your cluster).
To get the name of your cluster $ hasura cluster status

Local Deployment: Follow these instructions to get the code working on your machines locally. (Chrome web browser is preferred)


To see the app in action you can follow the instructions below:

* In your terminal input the following commands to clone the repo ans start the dev-server

```sh
$ git clone 

$ cd 

# install dependencies
$ npm install

#start the dev-server
$ npm start
```

* Now navigate to `localhost:3000` in your browser


##Tutorial

Follow along for a step by step guide on developing this app

## Getting started

### Step 1 - Install create-react-app

```sh
$ npm install -g create-react-app
```

The above command will install create-react-app globaly which is a tool to Create React apps with no build configuration.

### Step 2 - Creating a basic project

```sh
$ create-react-app my-app
$ cd my-app
```

The above command does the following:

1. Creates a new folder in the current working directory called `my-app`
2. Populate the directory with the required files to get started with a react app

### Step 3 - Installing Material-Ui

```sh
$ npm install material-ui
```
This command will install ant design and save it to the `package.json` file.

### Step 4 - Installing the Ant Design Framework

```sh
$ npm install antd --save
```

This command will install ant design and save it to the `package.json` file.

### Step 5 - Configuring the project

To use some advance features provided by the material-ui ant design we need to configure it a bit, follow the official guid material-ui: http://www.material-ui.com/#/ ant design: https://ant.design/docs/react/use-with-create-react-app


