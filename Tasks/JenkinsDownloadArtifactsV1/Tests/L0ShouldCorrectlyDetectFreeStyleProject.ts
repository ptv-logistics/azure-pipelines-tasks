import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');
import mockTask = require('azure-pipelines-task-lib/mock-task');
import helper = require("./JenkinsTestHelper");

const taskPath = path.join(__dirname, '..', 'jenkinsdownloadartifacts.js');
const tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput("serverEndpoint", "ID1");
tr.setInput("jobName", "myfreestyleproject")
tr.setInput("saveTo", "jenkinsArtifacts");
tr.setInput("filePath", "/");
tr.setInput("jenkinsBuild", "BuildNumber");
tr.setInput("jenkinsBuildNumber", "10");
tr.setInput("itemPattern", "**");
tr.setInput("downloadCommitsAndWorkItems", "false");

process.env['ENDPOINT_URL_ID1'] = 'http://url';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_username'] = 'dummyusername';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_password'] = 'dummypassword';
process.env['ENDPOINT_DATA_ID1_acceptUntrustedCerts'] = 'true';

helper.RegisterArtifactEngineMock(tr);
helper.RegisterHttpClientMock(tr, (url: string) => {
    if (url === "http://url/job/myfreestyleproject//api/json") {
        return helper.GetSuccessExpectedResult('{ "_class": "hudson.model.FreeStyleProject" }');
    }
    if (url === "http://url//job/myfreestyleproject//20/api/json?tree=artifacts[*]") {
        return helper.GetSuccessExpectedResult('{ "_class": "hudson.model.FreeStyleBuild", "artifacts": [ "abc" ] }');
    }
});

tr.run();
