# Contributing

Admin Portal follows a `main | uat | staging` branching structure. You will want to work off of the "staging" branch. When you submit a Pull Request, it will be from your local to the branch "we45/appsecengineer-admin-ui/staging."

## How to run the project

### Install the dependencies

```bash
yarn
```

### The .env file

We don't use any kind of `.env` files in this project. All the environment variables are set in [`/src/config.js`](src/config.js) file.

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
```

## How to prettify the code

We use [Prettier](https://prettier.io/) to prettify the code. Please make sure you have the Prettier extension installed in your IDE and set as default formatter.
On your files you can simply do:

- `⇧ Shift` + `⎇ Alt` + `F` (Windows);
- `⇧ Shift` + `⌥ Option` + `F` (Mac);

### Create a Pull request

If you are a newcomer, your first month is required to create your branches and pull requests for your tasks.

After your first month you will be able to commit directly to the `staging` branch.

## Building and Deploying your changes

Currently there is no need to build and deploy the application.
After your commit and push, the build will be done automatically through Cloudflare.
The deployment will be done automatically as well.
