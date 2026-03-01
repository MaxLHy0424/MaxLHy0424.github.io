git remote add template https://github.com/matsuzaka-yuki/Mizuki.git
git fetch template
git merge template/master --allow-unrelated-histories
git remote remove template