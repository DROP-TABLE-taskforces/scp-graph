# scp-graph
Here put commands you need to use to set it up:
> - Set name of local git repo "origin" and main branch "main"
> - If `cronscript.sh` only runs once, use the command `setsid bash path/to/cronscript.sh >/dev/null 2>&1 </dev/null &` and let it run for about two days
> - Or if autocommits are not desired, run `setsid node path/to/main.js >log.txt 2>&1 </dev/null &`; same runtime