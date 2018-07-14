const fs = require("fs");
const exec = require("child_process").execSync;

const cmdWrapperModule = (function () {
	function runExecutable(commander, commanderArguments, workingDirectory) {
		try {
			const cmd = commander + commanderArguments + workingDirectory;
			exec(cmd);
			return 0;
		}
		catch (err) {
			console.log(`An error occured: ${err}`);
			return 1;
		}
	}
	return {
		runExecutable
	};
}());
module.exports = cmdWrapperModule;
