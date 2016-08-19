#!/bin/bash
set -e -v

# srlt restore
#
# rsync -avzh --exclude-from '.gitignore' ./ makai-sailing:/root/work/src/github.com/ijsnow/makaisailing
scp ./config.yaml makai-sailing:/root/work/src/github.com/ijsnow/makaisailing/config.yaml
scp ./config.yaml makai-sailing:/root/work/bin/config.yaml

# ssh makai-sailing NODE_ENV=production 'bash -s' <<'ENDSSH'
#   cd /root/work/src/github.com/ijsnow/makaisailing
#   npm install
#   make build
#   /root/work/bin/makaisailing run &
# ENDSSH

ssh makai-sailing NODE_ENV=production 'bash -s' <<'ENDSSH'
  cd /root/work/src/github.com/ijsnow/makaisailing
  make build
  /root/work/bin/makaisailing run &
ENDSSH
