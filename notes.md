
# Notes for 2019 Numerical Analysis

## Research Setup

#### Docker

Using this [guide](https://docker-curriculum.com/). 
Docker keeps image and runs them on containers. The same image can be run on multiple containers <https://stackoverflow.com/a/23736802>, <https://stackoverflow.com/a/26960888>.

[TTY](http://www.linusakesson.net/programming/tty/index.php) 

`docker run [image]` runs image in a new container. Docs don't explicitly state where docker image is saved if `run` is called before `pull` but I'm assuming `pull` is implicit in this case <https://docs.docker.com/engine/reference/commandline/run/>.  
`docker images` lists all docker images that I saved locally.  
`docker pull [image]` fetches docker images and saves it locally.  
`docker ps -a` lists all containers.  
`docker run [image] [command]` run image with command in new container.  
`docker run -it [image] [command]` run image with command in new container and assign an interactive bash shell to user for container.  
`docker rm $(docker ps -a -q -f status=exited)` to remove all containers that are exited (and clear space).
`docker rm $(docker ps -aq)` to remove all containers.
`docker rmi [image]` removes the image from list

Using the guide: `docker run -d -P --name static-site prakhar1989/static-site`. `-d` detaches our terminal, `-P` will publish exposed ports to random ports and `--name` renames the container. After calling, run `docker port static-site`

#### Sourcegraph

Run sourcegraph with this [command](https://docs.sourcegraph.com/#quickstart).

```bash
docker run --publish 7080:7080 --publish 2633:2633 --rm --volume ~/.sourcegraph/config:/etc/sourcegraph --volume ~/.sourcegraph/data:/var/opt/sourcegraph sourcegraph/server:3.3.7
```

[Add repositories already cloned to disk](https://docs.sourcegraph.com/admin/repo/add_from_local_disk)

This creates a persisting data storage/config folder called `~/.sourcegraph` and I can add search repositories here: `~/.sourcegraph/data/repos` using `git clone`.

Sort the contributors of Mercurial repo by number of commits   
`hg log --template "{author|person}\n" | sort | uniq -c | sort -nr`

## Search Learnings

#### PETSc

Build scripts and configuration `lib/petsc`

`SNESLineSearch` (`src/snes/linesearch`)

Source implementation at `src/snes/linesearch`, headers at `include/petscsnes.h` 

`SNESLineSearch` is a Abstract PETSc object that manages nonlinear problems (non-linear solvers). It has type `SNESLineSearchType` tests it the line search method to use:

`SNESLINESEARCHBT` is backtracking line search, implemented in `SNESLineSearchApply_BT` in `src/snes/linesearch/impls/bt/linesearchbt.c`. Here it uses `.5*g <= .5*f + lambda*alpha*initslope` to check sufficient tolerence.

SNESLINESEARCHNLEQERR
SNESLINESEARCHBASIC
SNESLINESEARCHL2

`SNESLINESEARCHCP` critical point line search. Implemented: `src/snes/linesearch/impls/cp/linesearchcp.c`

SNESLINESEARCHSHELL

`FUN3D` (`src/contrib/fun3d`) 

3-D, Unstructured Compressible Euler Solver originally written by W. K. Anderson of NASA Langley, and ported into PETSc framework by D. K. Kaushik, ODU and ICASE.
Finite volume flux split solver for general polygons `src/contrib/fun3d/comp/flow.c`. Note sure how this solver is called.
<http://127.0.0.1:7080/www.github.com/petsc/petsc/-/blob/src/contrib/fun3d/comp/flow.c?utm_source=share#L109>

`src/mat/examples/tests/` contains tests for Matrix functions

#### Octave

AOptimization scripts here. Has documentation; owned by GNU Octave.  

`scripts/optimization/fsolve.m`: function has signature `function [x, fval, info, output, fjac] = fsolve (fcn, x0, options = struct ())`

`scripts/optimization/fminsearch.m` `function [x, fval, exitflag, output] = fminsearch (varargin)`


## Defects4J / Commons Math

[Defects4J Documentation](https://people.cs.umass.edu/~rjust/defects4j/html_doc/index.html)

`defects4j info -p Math` to get information about Commons Math  
`defects4j info -p Math -b 1` to get the first bug  
project_id: Chart, Closure, Lang, Math, Mockito, Time  



## Numerical Analysis

#### Poisson problem

Description of the problem <http://users.cs.northwestern.edu/~jet/Teach/2004_3spr_IBMR/poisson.pdf>

#### Riemann Problem

<https://en.wikipedia.org/wiki/Riemann_solver>

#### Helmholtz Equation

<https://en.wikipedia.org/wiki/Helmholtz_equation>
