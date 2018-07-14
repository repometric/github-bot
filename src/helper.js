const del = require("del");
const mkdirp = require("mkdirp");
const path = require("path");
const process = require("process");
const cmdWrapper = require('./cmdWrapper');

var helperModule = (function () {
	const getWorkingDirectory = (sha) => {
		const workingDirectory = path.join(process.cwd(), sha);

		try {
			mkdirp.sync(workingDirectory);
		}
		catch (err) {
			console.log(`An error occured: ${err}`);
			setStatus(context, "error");
		}

		return workingDirectory;
	};

	const deleteWorkingDirectory = (workingDirectory) => {
		try {
			del.sync(workingDirectory);
		}
		catch (err) {
			console.log(`An error occured: ${err}`);
			setStatus(context, "error");
		}
	};

	const runGit = (context, gitUrl, gitBranch, workingDirectory) => {
		try {
			gitUrl = `https://github.com/${gitUrl}`;
			const result = cmdWrapper.runExecutable("git clone ", ` -b ${gitBranch} ${gitUrl} `, workingDirectory);
		}
		catch (err) {
			console.log(`An error occured: ${err}`);
			deleteWorkingDirectory(workingDirectory);
			setStatus(context, "error");
		}
	};

	const runAnalysis = (cotext, workingDirectory) => {
		try {
			const result = cmdWrapper.runExecutable("jshint ", "", workingDirectory);
			return result;
		}
		catch (err) {
			console.log(`An error occured: ${err}`);
			deleteWorkingDirectory(workingDirectory);
			setStatus(context, "error");
		}
	};

	const setStatus = (context, statusArgument) => {
		const { title, html_url: htmlUrl, head } = context.payload.pull_request;
		let information;
		switch(statusArgument){
			case "error":
			information = "There are some errors"
			break;
			case "success":
			information = "Check is now completed";
			break;
			case "pending":
			information = "Running analysis"
			break;
		}
		return context.github.repos.createStatus(context.repo({
			sha: head.sha,
			state: statusArgument,
			target_url: '',
			description: information,
			context: 'little&smart'
		}));
	}

	return {
		getWorkingDirectory,
		deleteWorkingDirectory,
		runGit,
		runAnalysis,
		setStatus
	};
}());
module.exports = helperModule;
