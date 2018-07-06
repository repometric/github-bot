const express = require('express');
const webHooks = require('node-webhooks')


const application = express();

application.post('/', (req, res) => {
    webHooks.add('checker', 'urlfromgit').then(function () {
		console.log(req);
		console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
		console.log(req.params);
        let helper = new helper();

			let action = req.action;
			if (action != "opened" && action != "reopened")
			{
				return Json("No new pull requests.");
			}

			/*var token = Configuration["GitHubToken"];
			if (string.IsNullOrEmpty(token))
			{
				return JSON.stringify("Can't find a token.");
			}*/

			if (!req.pull_request)
			{
				return JSON.stringify("Can't find information about pull request.");
			}

			let statusUrl = req.pull_request.statuses_url;
			if (!statusUrl)
			{
				return Json("Unknown status url.");
			}

			//await helper.PostStatus(statusUrl, "pending", "Running analysis");
			
			let sha = req.pull_request.head.sha;

			let workingDirectory = helper.GetWorkingDirectory(sha);
			helper.runGit(req, workingDirectory);
			let haveErrors = helper.runAnalysis(workingDirectory);
			helper.deleteWorkingDirectory(workingDirectory);

			if (haveErrors){
				//await helper.PostStatus(statusUrl, "error", "There are some errors");
			}
			else{
				//await helper.PostStatus(statusUrl, "success", "Check completed");
			}

			return Ok("Done");
    }).catch(function (err) {
        console.log(err)
    })
});
module.exports = application;
