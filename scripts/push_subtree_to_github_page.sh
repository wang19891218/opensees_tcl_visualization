echo openseestclvisualization.app.hfwang.dev > dist/CNAME
git add dist
git commit -m "add CNAME to dist" 
git subtree push --prefix dist origin gh-pages

