const url     = require("url");
const path    = require("path");
const program = require("commander");
const express = require("express");
const axios   = require("axios");
const moment  = require("moment");

const isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

const isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

const print = function(stmt) {
    if(isObject(stmt) || isArray(stmt)) {
        console.log(JSON.stringify(stmt, null, 3));
    } else {
        console.log(stmt);
    }
}

const printErr = function(stmt) {
    if(isObject(stmt) || isArray(stmt)) {
        console.log(`ERROR: ${JSON.stringify(stmt, null, 3)}`);
    } else {
        console.log(`ERROR: ${stmt}`);
    }
}

const convDate = function(str) {
    return moment(str).format("D MMM, YYYY");
}

const ownerID = process.argv[2];
const repoID  = process.argv[3];
const apiPage = "https://api.github.com";
const queryRepo = url.resolve(apiPage,
    path.join("repos",ownerID,repoID)
);
// query string for contributors
// example:
// https://api.github.com/repos/coin-or/pulp/contributors
const queryRepoContributors = url.resolve(apiPage,
    path.join("repos",ownerID,repoID,"contributors")
);
// query string for commits
// example:
// https://api.github.com/repos/coin-or/pulp/commits
const queryRepoCommits = url.resolve(apiPage,
    path.join("repos",ownerID,repoID,"commits")
);

const getContributors = function() {
    return axios.get(queryRepoContributors)
        .then(response => {
            const contributors = response.data;
            if(isArray(contributors)) {
                const numberOfContributors = contributors.length;
                let names = "";
                print(`number of contributors: ${numberOfContributors}`);
                contributors.forEach(contributor => {
                    names += `${contributor.login}; `
                });
                print(`contributors: ${names}`);
            } else {
                print("can't get contributors");
            }
        });
}

const getCommitDetails = function() {
    return axios.get(queryRepo)
        .then(resp => {
            const creationDate = resp.data.created_at;
            print(`earliest commit ${convDate(creationDate)}`);
            return axios.get(queryRepoCommits);
        })
        .then(resp => {
            const commits = resp.data;
            if(isArray(commits) && commits.length > 0) {
                const lastCommitDate = commits[0].commit.committer.date;
                print(`latest commit ${convDate(lastCommitDate)}`);
            } else {
                print("can't get commits or none exist");
            }
        });
}

print(`getting: ${queryRepoContributors}`);
getContributors()
    .then(() => {
        return getCommitDetails();
    })
    .catch(error => {
    console.log(error);
  });

