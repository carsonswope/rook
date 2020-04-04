# Rook

starter project copied from: https://github.com/DavideViolante/Angular-Full-Stack

## Prerequisites
1. Install node and npm. should be able to run `node -v` and `npm -v` from terminal
2. From project root folder install all the dependencies: `npm i`

## Run
`npm run dev`: A window will automatically open at `localhost:4200`. Source files are being watched. Any change automatically restarts server & reloads browser
`npm run prod`: run the project with a production bundle and AOT compilation listening at `localhost:3000`

## gcloud
configured to be deployed in GCP.
To deploy:
1. Install GCP command line SDK
2. Create a project & an App Engine version
3. `gcloud app deploy` in root directory