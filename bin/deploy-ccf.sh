#!/bin/sh

echo on
echo 'Deploying aminer2b [CCF] system into 103 server...'
echo 'You must first set your development version with ccf first!';
echo '\n\n'

cd ../

echo 'Update git'
git reset --hard
git pull origin master

echo 'Update runtime system config.'
cp ./src/utils/config.js ./bin/old-config.js
sed 's/const SYS = .*;/const SYS = '\''ccf'\'';/g' ./bin/old-config.js > ./src/utils/config.js

echo 'Building...'
npm run build || exit

echo 'Restore config file.'
mv ./bin/old-config.js ./src/utils/config.js

echo 'Update...'
scp -r dist root@47.94.231.103:ccf/ || exit
