module.exports = littleSmart;

const handlePullRequest = require('./handlePullRequest');
/**
 * Marks webhooks to listen to and listens to them.
 * @param  {Application} robot - an instance of Application. Gives the
 * service access to all of the GitHub webhooks.
 */
function littleSmart(robot) {
  robot.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.edited'
  ], handlePullRequest);
}
