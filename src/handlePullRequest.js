const helper = require("./helper.js");

function handlePullRequest(context) {
  const task = helper.setStatus(context, "pending");

  Promise.all([task]).then(data => {
    const { title, html_url: htmlUrl, head } = context.payload.pull_request;

    const workingDirectory = helper.getWorkingDirectory(head.sha);

    helper.runGit(context, head.repo.full_name, head.ref, workingDirectory);

    const errors = helper.runAnalysis(context, workingDirectory);

    helper.deleteWorkingDirectory(workingDirectory + "\\**");

    if (errors) {
      helper.setStatus(context, "error");
    }
    else {
      helper.setStatus(context, "success");
    }
  })
}
module.exports = handlePullRequest;
