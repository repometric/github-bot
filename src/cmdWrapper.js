const exec = require('child_process').execSync;

const cmdWrapperModule = (function() {
	/**
 	* Launches a child process, supervising results of its work.
 	*@param {string} commander - Commands to be executed via command line
	*@param {string} commanderArguments - Argumends passed to the commands to
	specify their work
	*@param {string} workingDirectory - Path to the directory, which is necessary
	to know to execute commands.
	*@return {number}
	*/
	function runExecutable(commander, commanderArguments, workingDirectory) {
		try {
			const cmd = commander + commanderArguments + workingDirectory;
			exec(cmd);
			return 0;
		} catch (err) {
			console.log(`An error occured: ${err}`);
			return 1;
		}
	}
	return {
		runExecutable,
	};
}());
module.exports = cmdWrapperModule;
