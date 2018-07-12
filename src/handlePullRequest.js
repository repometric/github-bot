module.exports = handlePullRequest

async function handlePullRequest (context) {
  const {title, html_url: htmlUrl, head} = context.payload.pull_request
  const status = 'error';

  console.log(`Updating PR "${title}" (${htmlUrl}): ${status}`)

  context.github.repos.createStatus(context.repo({
    sha: head.sha,
    state: status,
    target_url: '',
    description: 'PR hasn\'t passed check',
    context: 'little&smart'
  }))
}
