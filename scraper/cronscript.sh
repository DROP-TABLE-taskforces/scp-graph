#!/usr/bin/env bash
# Script is designed to work in Bash and be periodically called by cron.
SCRIPT_DIR=$(dirname -- "$(readlink -f -- "$0")")
CR_DIR=$(pwd)
cd $SCRIPT_DIR
echo $(date '+%d.%m.%Y %H:%M:%S') $$ > log.txt
node --max-old-space-size=2048 main.js >> log.txt
git commit -a -m "scheduled update" >> log.txt
git fetch origin # complete with repo local name
git pull origin main # complete with repo local name and main branch
git push origin main # complete with repo local name and main branch
cd $CR_DIR