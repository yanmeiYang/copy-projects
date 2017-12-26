# 项目部署

### Aminer2b项目部署

##### aminer-cn上部署的步骤
	ssh <yourName>@ssh.aminer.cn -p 23333   //链接aminer.cn服务器
	sudo su aminer                     //切换到aminer
	cd
	cd proj/aminer2b-next-api         //进入目前在使用的项目
	git pull 远程仓库 分支名            //例如：git pull origin next-api
	vi src/utils/system.js           //查看config是否是要部署的项目src
	npm run build
	cd ../aminer2b-deploy
	cd 需要上线的系统的名称               //例如：cd ccf
	rm -rf *                          // 删除ccf目录下的所有文件，注意：**一定要在当前系统目录下**
	cp -r ../../aminer2b-next-api/dist/* .     //文件拷贝
	------------	
    // vi src/utils/system.js; npm run build 两行命令可以替换为下面一行命令
    system=<sourceName> yarn run build:deploy
	
##### aws上部署

######  目前只有 ***ACM*** 需要在cn和aws上同时部署

###### 只要在aminer-cn服务器的/home/aminer/proj目录下分别执行以下两行代码即可`
	1. rsync -avzhe ssh /home/aminer/proj/aminer2b-deploy/acm aminer-jh:/home/aminer/proj/aminer2b-deploy
	2. rsync --del -avzhe ssh /home/aminer/proj/aminer2b-deploy/acm aminer-jh:/home/aminer/proj/aminer2b-deploy

### Aminer项目部署

##### aminer-cn上部署的步骤
	ssh <yourName>@aminer.cn -p 23333
	sudo su aminer
	cd
	cd proj
	cd aminer-web-X            //切换到备用目录，例如当前aminer-web -> aminer-web-1，应切换到aminer-web-0
	git pull 远程仓库名 分支名   //例如：git pull origin master
	./deploy.sh                //build
	cd ../
	rm -rf aminer-web && ln -sf aminer-web-X aminer-web   //删除当前链接，创建新的软连接；根据上面的例子应为aminer-web-0
	
##### aws上部署的步骤
	ssh 166.111.7.105     //通过111做跳板，在308以外不能直接访问aminer-jh
	ssh aminer-jh        // aminer-jh的ip为35.161.192.240
	www
	cd
	ll                  //查看当前软连接的指向，例如：web -> /var/www/web1
	cd webX             //切换到备用的目录，例如：cd web0
	git pull 远程仓库名 分知名     //git pull https master；可以通过git remote -v查看当前远程仓库名
	use-webX   //实际执行的就是删除当前软连接并创建一个新的链接
	
### NSFC项目部署（目录在/var/aminer/aminer-nsfc）
	ssh 166.111.7.105
	ssh root@159.226.244.57  //应该是nsfc他们的服务器
	su aminer
	tmux attach -t aminer
	git pull origin nsfc
> 如果代码已经更新(git log)到最新，页面没有变化，可以执行以下命令
	1. npm install
	bower install
	grunt clean build
	
### NSFC项目的访问
	需要在hosts中增加一条配置，具体做法如下
	sudo vi /etc/hosts
	159.226.244.57 api-profile.nsfc.gov.cn profile.nsfc.gov.cn  //在hosts添加一条这个配置，并且只能在308访问



