# 2019S Scoping Review

## Protocol	

Scoping review on numerical methods / scientific computing software 	
Goal is to record / observe software development

## Search strategies	

The list of scientific computation software is obtained from multiple sources, mainly from Github, since there is no systematic way to obtain such a list.

1) Github search bar.
    + Skip: lecture material, book, resources, discussions, course material, examples
    + <https://github.com/search>

2) Github search bar with `language:[language of choice]` passed in.
    + Example: <https://github.com/search?q=ode+language%3Apython>

3) Github topics.
    + Skip: lecture material, book, resources, discussions, course material, examples	
    + <https://github.com/topics>

4) GNU software package.
    + List: <https://www.gnu.org/software>
    + List: <https://en.wikipedia.org/wiki/List_of_GNU_packages#Scientific_software>	

5) Language specific package indices
    + Python package index <https://pypi.org>
    + Anaconda / conda-forge package index <https://anaconda.org/conda-forge/repo>

6) Github lists. Some users maintain a list of software in Github repositories.
    + List: <https://github.com/nschloe/awesome-scientific-computing>

7) Individual software well known by the software research community.
    + Commons Math (Java) mentioned in Reid paper	
    + Sundials (C++)

8) math kernel / header only library
    + Most are only basic math and linear algebra so not relevant to our interests

When a relevant software is found I also view the repo owner page. Owners often maintain similar software to my interests.

To simplify search I selected only languages commonly used in math for searches: Java, C, C++, Fortran, Jullia, Matlab, Octave, R, Python.

## Software search	

| field             | description                                                 |
|:------------------|:------------------------------------------------------------|
| index             | obtained from first line of github/gitlab/bitbucket repo page; for reference and indexing |
| title             | title of the software/library/package |
| repo              | website of repository	|
| website           | website of software |
| Repository/websit e details | copy and paste sentences from repository/website that describe software |
| language(s)       | I add list programming languages that have >30% representation	|
| aux. language     | if source uses language <30% representation but is key to function (i.e. software uses CUDA, Torch) |
| package/library?  | classify software type. Is it a standalone solver, an interface/wrapper of another software, or library, etc (make: user compiles code; solver: standaone sci. comp. software; xxx package/library: part of a package archive) |
| category          | see categories list in <learnings>	|
| description	    |  my description of the software |
| owner?            | name, department, organization, company, and other relevant details of software owner |
| version control?  | which source control dues repo use? | 
| dependencies?     | scientific computing / numerical dependences required or builtin to software; obtained from dependency list in README.md in repository or by viewing source files |
| documentation?    | link to documentation |
| tests suite?	    |  link to test suite |
| test coverage/int egration? | the coverage/integration apps the repo uses (i.e. codecov.io, coveralls.io, AppVeyor, Travis CI, Circle CI)	|
| example code?	    | link to example code |
| benchmarks?       | scripts for benchmark/performance checks; research publications on performance/properties of the software. Performance can be about speed and accuracy of algorithm |
| issue tracker?    | link to issue tracker |
| org slug          | obtained from repo URL	
| repo slug         | (crawler.js) obtained from repo URL |
| repo size         | (crawler.js) obtained by adding up bytesize by language in [size language] |
| size language     | (crawler.js) calculated from bytesize counts by language from API response <https://api.github.com> |
| \# files          | (crawler.js) obtained by downloading git repository and then call to cloc <https://github.com/AlDanial/cloc>	|
| \# LoC            | (crawler.js) obtained by downloading git repository and then call to cloc <https://github.com/AlDanial/cloc>	|
| \# files by lang. | (crawler.js) obtained by downloading git repository and then call to cloc <https://github.com/AlDanial/cloc> |
| \# LoC by lang.   | obtained by downloading git repository and then call to cloc <https://github.com/AlDanial/cloc>	|
| \# commits        | obtained from parsing repo html page using cheerio <https://github.com/cheeriojs/cheerio> |
| created date      | from API response <https://api.github.com> |
| last commit       | from API response <https://api.github.com> |
| \# contributors   | from API response <https://api.github.com>; response caps contributor lists to 30, ranked by *contributions by contributor* |
| search strategy   | where this entry is obtained from |

**\# contributors**: *contributions by contributor*: from API response <https://api.github.com>; contributions include commits to master, opening issues, proposing pull requests, submitting a pull request review, coauthoring commits to master <https://help.github.com/en/articles/viewing-contributions-on-your-profile>	

### Crawler for Software Search

Half of software search was automated using the `crawler` script. The crawler script reads a `in.csv` file as input. Each row contains an `[owner slug]` in first column and `[repo slug]` as the second column. The crawler then access `https://api.github.com/repo/[owner slug]/[repo slug]`. In order to use the script you need to provide auth tokens to Github API when performing queries. See the code `crawler` for details.

- Some numerical figures were retrieved by HTML crawling the repo. page using Cheerio.
    + Library <https://cheerio.js.org/>

- Basic Github data was retrieved from the Github REST API (v3), a JSON response API queried using AJAX library Axios.
    + API entrypoint <https://api.github.com>
    + Github REST API (v3) documentation <https://developer.github.com/v3/>
    + Library <https://github.com/axios/axios>

- Source code details is obtained using a bash script `cloc-git` that clones every repository in the `in.csv` file, and then runs `cloc` on it.
    + Library <https://github.com/AlDanial/cloc>

## Issues

To evaluate the relevance of the software repository for our study of numerical bugs I looked for issues relating to numerical converge, iterations, etc. In the worst case scenario I looked at issues of marginal relation such as runtime object state management and floating point errors.

| field                  | description                                             |
|:-----------------------|:--------------------------------------------------------|
| title                  | |
| title                  | |
| repo                   | |
| link                   | |
| Defect4J               | |
| bug category           | I came up with bug categories by sampling issues |
| issue name             | |
| issue site description | |
| issue my description   | I described or copied any interesting detail regarding how the bug was fixed, etc |
| patch?                 | yes if JIRA / Github issue contains a downloadable patch |
| assoc. with commit     | link to associated commit where issue was fixed if any |
| issue link             | link to issue in JIRA / Github |
| extra link/notes       | |
| email link 2           | |
| email link 3           | |
| date (created)         | |
| notes                  | |

**Bug category**:

| field                  | description                                             |
|:-----------------------|:--------------------------------------------------------|
| software engineering   | bug not particularly related to numerical algorithm but to memory, type assignment, data types, etc |
| floating pt arithmetic | bug relating to management of floating point numbers including overflow, floating point precision, etc. Software engineering bugs on floating point data will be categorized as floating point unless data is clearly hardcoded i.e. zero |
| convergence            | bug relating to solution verification of numerical algorithm such as convergence, error, discretization, iterative steps |
| state management       | some solvers in OO language use states or observer classes so I am categorizing bugs relating to them here |
| not a bug              | devs concluded that property of code is improperly flagged as a bug |
| documentation          | user found an issue with software documentation (including code comments) |
| unrelated (not used)   | bug not about scientific computing software (i.e. UI, compatibility with operating systems) |

**Issue my description**: additional tags:

| field    | description                                             |
|:---------|:--------------------------------------------------------|
| BUG      | description of the bug                                  |
| BUGFIX   | what devs did to fix the bug                            |
| COMMENT  | any useful comments/conversations the devs made in the issues tracker |

### Crawler for Commits and Issues Search

I began writing an automation script to retrieve Github issues and commits details from repositories. The script is unfinished as of now. I might finish this so I have a GraphQL prototype for my other projects.

## Related Work

Anthony Di Franco, Hui Guo, and Cindy Rubio-González. 2017. A comprehensive study of real-world numerical bug characteristics. In Proceedings of the 32nd IEEE/ACM International Conference on Automated Software Engineering (ASE 2017). IEEE Press, Piscataway, NJ, USA, 509-519.
url: <https://dl.acm.org/citation.cfm?id=3155562.3155627>








