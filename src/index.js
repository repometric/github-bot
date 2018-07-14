module.exports = littleSmart;

const handlePullRequest = require('./handlePullRequest');

function littleSmart(robot) {
  robot.on([
    'pull_request.opened',
    'pull_request.reopened',
    'pull_request.edited'
  ], handlePullRequest);
}
