#!/bin/sh

PROJECTROOT=~/IBFT-Network
cd $PROJECTROOT
./Node-1/startNode1.sh
sleep 10
ENODEURL=`grep 'Enode URL' ./Node-1/node1.log | awk '{print $12}'`
echo $ENODEURL

sed -i "s|##ENODEURL##|$ENODEURL|g" ./Node-2/startNode2.sh
sed -i "s|##ENODEURL##|$ENODEURL|g" ./Node-3/startNode3.sh
sed -i "s|##ENODEURL##|$ENODEURL|g" ./Node-4/startNode4.sh


$PROJECTROOT/Node-2/startNode2.sh
sleep 3
$PROJECTROOT/Node-3/startNode3.sh
sleep 3
$PROJECTROOT/Node-4/startNode4.sh
