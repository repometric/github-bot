let fs = require('fs');

const cmdWrapper = (function () {

    const runExecutable = (commander, commanderArguments, workingDirectory, waitTimeout = -1) => {
        let runResults;
        runResults.runException = null;

        try {
            fs.access(workingDirectory, function (error) {
                if (error) {
                    throw new ArgumentException("Invalid executable path.", "executablePath");
                }
                else {
                runResults.ExitCode = process.ExitCode;
                    let exec = require('child_process').exec;
                    let cmd = commander + commanderArguments+ workingDirectory;

                    exec(cmd, function (error, stdout, stderr) {
                        // command output is in stdout
                        if(error.istanceof(Error)){
                            runResults.exitCode = 1;
                            runResults.error = error;
                        }
                        else{
                            runResult.exitCode = 0;
                            runResults.output = output;
                        }
                    });
                }
            });
        }
        catch (e) {
            runResults.RunException = e;
            runResults.exitCode = 1;
        }

        return runResults;
    }

    return runExecutable;
}());
module.exports = cmdWrapper;
