echo "switching to branch master"
git checkout master

git "Building the project"
npm run build

echo "Deploying files to server"
scp -r build/* administrateur@172.16.20.85:/var/www/172.16.20.85/

echo "Deployment done"
