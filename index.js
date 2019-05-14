const url     = require("url");
const path    = require("path");
const program = require("commander");
const express = require("express");
const axios   = require("axios");
const moment  = require("moment");
const cheerio = require("cheerio");
const util    = require("util");
const execFile = util.promisify(require("child_process").execFile);
const csvStringify = util.promisify(require("csv-stringify"));
const csvParse = util.promisify(require("csv-parse"));
const appendFile = util.promisify(require("fs").appendFile);
const readFile = util.promisify(require("fs").readFile);

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
};

const throwErr = function(stmt) {
    if(isObject(stmt) || isArray(stmt)) {
        throw `ERROR: ${JSON.stringify(stmt, null, 3)}`;
    } else {
        throw `ERROR: ${stmt}`;
    }
};

const convDate = function(str) {
    return moment(str).format("D MMM, YYYY");
};

const byteFormat = function(val) {
    const GBfactor = 0.000000001;
    const MBfactor = 0.000001;
    const KBfactor = 0.001;
    const GBsize = (val * GBfactor).toFixed(2);
    const MBsize = (val * MBfactor).toFixed(2);
    const KBsize = (val * KBfactor).toFixed(2);
    if(GBsize >= 1.0) { return `${GBsize} GB`; }
    else { return (MBsize >= 1.0) ? `${MBsize} MB` : `${KBsize} KB`; }
};

const csvFile   = "out.csv";
const csvInput  = "in.csv";
const sitePage  = "https://github.com";
const apiPage   = "https://api.github.com";

const makeEntry = function(ownerID, repoID) {

    const queryRepo = url.resolve(apiPage,
        path.join("repos",ownerID,repoID)
    );

    const queryPage = url.resolve(sitePage,
        path.join(ownerID,repoID)
    );

// query string for contributors
// example:
// https://api.github.com/repos/coin-or/pulp/contributors
    const queryRepoContributors = url.resolve(apiPage,
        path.join("repos",ownerID,repoID,"stats","contributors")
    );

// query string for commits
// example:
// https://api.github.com/repos/coin-or/pulp/commits
    const queryRepoCommits = url.resolve(apiPage,
        path.join("repos",ownerID,repoID,"commits")
    );

    const queryRepoLanguages = url.resolve(apiPage,
        path.join("repos",ownerID,repoID,"languages")
    );

// https://github.com/AlDanial/cloc.git
    const repoGitURL = url.resolve(sitePage,
        path.join(ownerID,`${repoID}.git`)
    );

    const getContributors = function(arr) {
        return axios.get(queryRepoContributors)
            .then(response => {
                const contributors = response.data;
                if(isArray(contributors)) {
                    const numberOfContributors = contributors.length;
                    let contribCount = "";
                    contributors.forEach(contributor => {
                        contribCount += `${contributor.author.login}: ${contributor.total}; `
                    });
                    return arr.concat([
                        numberOfContributors,
                        contribCount
                    ]);
                } else {
                    throwErr("can't get contributors");
                }
            });
    }

    const getCommitDetails = function(arr) {
        return axios.get(queryRepo)
            .then(resp => {
                let creationDate = resp.data.created_at;
                creationDate = convDate(creationDate);
                return Promise.all([creationDate, axios.get(queryRepoCommits)]);
            })
            .then(([creationDate, resp]) => {
                const commits = resp.data;
                if(isArray(commits) && commits.length > 0) {
                    let lastCommitDate = commits[0].commit.committer.date;
                    lastCommitDate = convDate(lastCommitDate);
                    return arr.concat([creationDate, lastCommitDate]);
                } else {
                    throwErr("can't get commits or none exist");
                }
            });
    }

    const getCommitNumber = function(arr) {
        return axios.get(queryPage)
            .then(resp => {
                if(typeof resp.data == "string") {
                    const $ = cheerio.load(resp.data);
                    const commitBox = $("html").find(".commits").first();
                    let commits = commitBox.children("a").first().children("span").first().text();
                    commits = commits.replace(/,/g,"");
                    commits = parseInt(commits, 10);
                    return arr.concat([commits])
                } else {
                    throwErr("can't get html file");
                }
            });
    }

    const getLanguageSizeInBytes = function(arr) {
        return axios.get(queryRepoLanguages)
            .then(resp => {
                const sizes = resp.data;
                let totalBytes = 0;
                let langBytes  = "";
                Object.keys(sizes).forEach(key => {
                    totalBytes += sizes[key];
                    const size = byteFormat(sizes[key]);
                    langBytes += `${key}: ${size}; `;
                });
                totalBytes = byteFormat(totalBytes);
                return arr.concat([
                    totalBytes,
                    langBytes
                ]);
            });
    }

    const getLOCAndFileCounts = function(arr) {
        return execFile(path.resolve(__dirname, "cloc-git"), [repoGitURL], {})
            .then(({stdout, stderr}) => {
                const langs = JSON.parse(stdout)
                let LOCCount  = "";
                let fileCount = "";
                Object.keys(langs).forEach(lang => {
                    if(lang === "header" || lang === "SUM") { } else {
                        LOCCount  += `${lang}:${langs[lang].code}; `;
                        fileCount += `${lang}:${langs[lang].nFiles}; `;
                    }
                });
                const totalLOCCount = langs.SUM.code;
                const totalFileCount = langs.SUM.nFiles;
                return arr.concat([
                    totalFileCount,
                    totalLOCCount,
                    fileCount,
                    LOCCount
                ]);
            });
    };

    print(`gathering from ${ownerID}/${repoID}`);
    return Promise.resolve([ ])
        .then((arr) => {
            print("getting size by language");
            return getLanguageSizeInBytes(arr);
        })
        .then((arr) => {
            print("getting LoC and file counts");
            return getLOCAndFileCounts(arr);
        })
        .then((arr) => {
            print("getting number of commits");
            return getCommitNumber(arr);
        })
        .then((arr) => {
            print("getting commit details");
            return getCommitDetails(arr);
        })
        .then((arr) => {
            print("getting contributor details");
            return getContributors(arr);
        })
        .then((arr) => {
            print(arr);
            print("got data; now writing...");
            return csvStringify([arr]);
        })
        .then((str) => {
            return appendFile(path.resolve(__dirname,csvFile), str);
        })
        .then(() => {
        })
        .catch(error => {
            print(`error with ${ownerID}/${repoID}`);
            print(error);
      });
};

const promiseLoop = function(rows, index) {
    if(index < rows.length) {
        const ownerID = rows[index][0];
        const repoID = rows[index][1];
        return makeEntry(ownerID, repoID)
            .then(() => {
                return promiseLoop(rows, index + 1);
            });
    }
    // else simply return null
};

// Main execution
Promise.resolve()
    .then(() => {
        print("writing header");
        const arr = ["repo size","size language","# files", "# LoC", "# files by lang.", "# LoC by lang.", "# commits", "first commit", "last commit", "# contributors", "# commits by contrib."];
        return csvStringify([arr]);
    })
    .then((str) => {
        return appendFile(path.resolve(__dirname,csvFile), str);
    })
    .then(() => {
        print("reading input csv file...");
        return readFile(path.resolve(__dirname,csvInput));
    })
    .then((data) => {
        return csvParse(data, {});
    })
    .then((rows) => {
        print("gathering information...");
        return promiseLoop(rows, 0);
    })
    .then((rows) => {
        print("DONE");
    })
    .catch(error => {
        print("error in main execution");
        print(error);
    });

