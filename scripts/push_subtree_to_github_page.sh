read -p "commit message:" commit_message 
echo windtunneldatavisualization.app.hfwang.dev > dist/CNAME
git add . 
git commit -m "$commit_message"
echo push to main 
git push
echo push dist to gh-pages
git subtree push --prefix dist origin gh-pages

