#!/bin/sh

echo on
echo 'Deploying aminer2b [tencent] system into 103 server...'
echo 'You must first set your development version with ccf first!';
echo '\n\n'

cd ../

echo 'Update git'
git reset --hard
git pull origin master

echo 'Update runtime system config.'
cp ./src/utils/config.js old-config.js
sed 's/const SYS = .*;/const SYS = '\''tencent'\'';/g' old-config.js > config.js
mv config.js ./src/utils/

echo 'Building...'
npm run build

echo 'Restore config file.'
mv old-config.js ./src/utils/config.js

echo 'Update...'
scp -r dist root@47.94.231.103:ccf/
