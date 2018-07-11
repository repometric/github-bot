/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.on(['pull_request.reopened', 'pull_request.opened'], async context => {
    // PR was created/reopened, what should we do with it?
  })
}
