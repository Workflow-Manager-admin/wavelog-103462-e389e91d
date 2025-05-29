#!/bin/bash
cd /home/kavia/workspace/code-generation/wavelog-103462-e389e91d/wavelog_main
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

