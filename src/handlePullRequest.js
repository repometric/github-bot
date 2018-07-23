const helper = require('./helper.js');
/**
 * Catches webhook from Github after pull request opening, reopening
 * or editing; clones changes from Github, launches analysis and, finally,
 * sets status of the pull request according to the results of analysis.
 * @param  {object} context - context got by listening to Github webhooks,
 * belongs to the pull request that caused launch of the function.
 */
function handlePullRequest(context) {
  const task = helper.setStatus(context, 'pending');

  Promise.all([task]).then((data) => {
    const { title, html_url: htmlUrl, head } = context.payload.pull_request;

    const workingDirectory = helper.getWorkingDirectory(head.sha);

    helper.runGit(context, head.repo.full_name, head.ref, workingDirectory);

    const errors = helper.runAnalysis(workingDirectory);

    helper.deleteWorkingDirectory(workingDirectory + '\\**');

    errors ? helper.setStatus(context, 'error') : helper.setStatus(context, 'success');

  });
}
module.exports = handlePullRequest;
