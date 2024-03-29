#!/bin/bash
RootPath=$(git rev-parse --show-toplevel)

echo "Project path $RootPath"

cd $RootPath

read -p "commit message:" commit_message 
echo https://openseestclvisualization.app.hfwang.dev > dist/CNAME
git add . 
git commit -m "$commit_message"
echo push to main 
git push
echo push dist to gh-pages
git subtree push --prefix dist origin gh-pages

