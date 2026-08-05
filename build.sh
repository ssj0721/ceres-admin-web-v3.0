#!/bin/bash 

echo "获取依赖文件"
echo "node版本号"
node -v
npm install

echo "更新补丁"
#cp -f ./src/util/avue.min.js ./node_modules/@smallwei/avue/lib
#cp -f ./src/util/jexcel.js ./node_modules/jexcel-pro/dist

echo "打包文件"
buildType=$1
npm run ${buildType:=build}

echo "传输文件"
echo "部署成功"
