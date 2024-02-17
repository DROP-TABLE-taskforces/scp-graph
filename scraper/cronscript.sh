#!/usr/bin/env bash
# Script is designed to work in Bash and be periodically called by cron.
SCRIPT_DIR=$(dirname -- "$(readlink -f -- "$0")")
CR_DIR=$(pwd)
cd $SCRIPT_DIR
echo $(date '+%d.%m.%Y %H:%M:%S') > log.txt
node main.js >> log.txt
git add * 2>/dev/null 1>>log.txt
git commit -m "scheduled update" >> log.txt
# git fetch # complete with repo local name
# git pull # complete with repo local name and main branch
# git push # complete with repo local name and main branch
cd $CR_DIR