const del = require('del');
const mkdirp = require('mkdirp');
const path = require('path');
const process = require('process');
const cmdWrapper = require('./runCmd');
const configuration = require('./config.json');

const helperModule = (function() {
	/**
	 * Creates a new directory in a current working directory if
	 * it does not exist already and names it with sha of the pull request
	 * which caused launch of the function.
	 * @param  {string} sha - sha of the pull request which caused launch
	 * of the function,
	 * @return {string}
	 */
	const getWorkingDirectory = (sha) => {
		const workingDirectory = path.join(process.cwd(), sha);

		try {
			mkdirp.sync(workingDirectory);
		} catch (err) {
			console.log(`An error occured: ${err}`);
			setStatus(context, 'error');
		}

		return workingDirectory;
	};
	/**
	 * Deletes the directory passed to the function with all its contents.
	 * @param  {string} workingDirectory - the directory to be deleted.
	 */
	const deleteWorkingDirectory = (workingDirectory) => {
		try {
			del.sync(workingDirectory);
		} catch (err) {
			console.log(`An error occured: ${err}`);
			setStatus(context, 'error');
		}
	};
	/**
	 * Clones pull request that caused launch of the function
	 * @param  {object} context - context got by listening to Github webhooks,
 	 * belongs to the pull request that caused launch of the function.
	 * @param  {string} gitUrl - URL of the repository, which contains information
	 * from the pull request that caused launch of the function.
	 * @param  {string} gitBranch - Specific branch of the repository,
	 * which contains information from the pull request that caused
	 * launch of the function.
	 * @param  {string} workingDirectory - The directory to clone repository
	 * branch to.
	 */
	const runGit = (context, gitUrl, gitBranch, workingDirectory) => {
		try {
			gitUrl = `https://github.com/${gitUrl}`;
			cmdWrapper.runExecutable('git clone ',
				` -b ${gitBranch} ${gitUrl} `, workingDirectory);
		} catch (err) {
			console.log(`An error occured: ${err}`);
			deleteWorkingDirectory(workingDirectory);
			setStatus(context, 'error');
		}
	};
	/**
	 * Launches analysis of the cloned repository branch.
	 * @param  {string} workingDirectory - The directory, containing
	 * cloned repository branch.
	 * @return {number}
	 */
	const runAnalysis = (workingDirectory) => {
		try {
			const result = cmdWrapper.runExecutable('jshint ', '', workingDirectory);
			return result;
		} catch (err) {
			console.log(`An error occured: ${err}`);
			deleteWorkingDirectory(workingDirectory);
			setStatus(context, 'error');
		}
	};
	/**
	 * Sends required status of the pull request to Github
	 * @param  {object} context - context got by listening to Github webhooks,
 	 * belongs to the pull request that caused launch of the function.
	 * @param  {string} statusArgument - status of the pull request to
	 * be sent to Github.
	 * @return {Function}
	 */
	const setStatus = (context, statusArgument) => {
		const {title, html_url: htmlUrl, head} = context.payload.pull_request;
		const information = configuration.statuses[statusArgument];
		return context.github.repos.createStatus(context.repo({
			sha: head.sha,
			state: statusArgument,
			target_url: '',
			description: information,
			context: 'little&smart',
		}));
	};

	return {
		getWorkingDirectory,
		deleteWorkingDirectory,
		runGit,
		runAnalysis,
		setStatus,
	};
}());
module.exports = helperModule;
