const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');
const path = require('path');
const process = require('process');

const helper = (function () {

    const getWorkingDirectory = (sha) => {
        let workingDirectory = path.join(process.cwd(), sha);

        mkdirp(workingDirectory, function (err) {
            // path exists unless there was an error
        });

        return workingDirectory;
    }

    const deleteWorkingDirectory = (workingDirectory) => {
        try {
            del([workingDirectory]);
        }
        catch (Exception) { }
    }

    const runGit = (data, workingDirectory) => {
        let gitUrl = data.pull_request.head.repo.git_url;
        let branch = data.pull_request.head;

        let gitExecutor = new cmdWrapper();
        let gitResult = gitExecutor.runExecutable("git clone ", gitUrl + "-b " + branch, workingDirectory);

        if (gitResult.exitCode == -1) {
            throw new Exception("GIT clone error.", gitResult.RunException);
        }
    }

    const runAnalysis = (workingDirectory) => {
        let cliExec = new cmdWrapper();
        let cliResult = {};

        cliResult = cliExec.runExecutable("jshint ", "", workingDirectory);

        if (cliResult.exitCode == -1) {
            throw new Exception("CLI analysis error.", cliResult.RunException);
        }

        let output = cliResult.output.ToString();
        return !cliResult.exitCode;
    }

    /*async Task < string > PostStatus(string statusUrl, string status, string description)
    {
    var token = Configuration["GitHubToken"];
    var name = Configuration["GitHubName"];
    var url = Configuration["GitHubUrl"];
    var content = new
        {
            state = status,
            target_url = url,
            description = description,
            context = name
        };
    var json = JsonConvert.SerializeObject(content);
    using(client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("User-Agent", name);
    client.DefaultRequestHeaders.Add("Authorization", $"token {token}");
    var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
    var response = await client.PostAsync(statusUrl, stringContent);

    //Log.LogInformation($"Status update: {status}. Result: {response.StatusCode}");

    return await response.Content.ReadAsStringAsync();
        }
    }*/

return {
    getWorkingDirectory,
    deleteWorkingDirectory,
    runGit,
    runAnalysis
}

}());
module.exports = helper;