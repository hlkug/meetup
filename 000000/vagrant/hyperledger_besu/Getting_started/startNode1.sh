#!/bin/sh

PROJECTROOT=~/IBFT-Network
NODEROOT=$PROJECTROOT/Node-1
nohup ~/besu/bin/besu --data-path=data --genesis-file=$PROJECTROOT/genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" > $NODEROOT/node1.log 2>&1 &

