# First Bolt App

This app includes slash commands, scheduled messaging, event and reaction handling, and message replying capabilities.

**Guide Outline**:

- [Setup](#setup)
  - [Create an App](#create-an-app)
  - [Tokens and installing apps](#tokens-and-installin-apps)
  - [Clone the Repository](#clone-the-repository)
- [Running Your Project Locally](#running-your-project-locally)
- [Deploying Your App](#deploying-your-app)

---

## Setup

### Create an app
First thing’s first: before you start developing with Bolt, you’ll want to create a [Slack app](https://api.slack.com/apps/new) and set it up.

### Tokens and installing apps
Slack apps use [OAuth to manage access to Slack’s APIs](https://api.slack.com/docs/oauth). When an app is installed, you’ll receive a token that the app can use to call API methods. Copy and store the required tokens into the .env. Then install the app into the workspace and the channel.

### Clone the Repostiory
With the initial configuration handled, it’s time to set up a new Bolt project. This is where you’ll write the code that handles the logic for your app.

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ git clone https://github.com/vedanivas/FirstBoltApp.git

# Change into the project directory
$ cd FirstBoltApp

# Install the required npm packages
$ npm i

# Rename the file .env_template to .env and fill in your tokens
$ mv .env_template .env
```

## Running Your Project Locally

To run the app locally:

```zsh
# Run app locally
$ node app.js
```

To stop running locally, press `<CTRL> + C` to end the process.


## Deploying Your App

Once development is complete, the app can be deployed using hosting environments like [AWS](https://slack.dev/bolt-js/deployments/aws-lambda) or [Heroku](https://slack.dev/bolt-js/deployments/heroku)