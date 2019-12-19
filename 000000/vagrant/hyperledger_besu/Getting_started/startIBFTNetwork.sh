#!/bin/sh

cd ~/IBFT-Network
./Node-1/startNode1.sh
sleep 10
ENODEURL=`grep 'Enode URL' ./Node-1/node1.log | awk '{print $12}'`
echo $ENODEURL


