#!/bin/bash

git add *
echo "Enter your commit message >> "
read COMMIT_MESSAGE
git commit -m "$COMMIT_MESSAGE"
git push origin

npm publish