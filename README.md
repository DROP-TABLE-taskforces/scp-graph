# scp-graph
Here put commands you need to use to set it up:
> - Set name of local git repo "origin" and main branch "main"
> - If `cronscript.sh` only runs once, use the command `setsid bash -c cronscript.sh >/dev/null 2>&1 < /dev/null &` and let it run for about a day