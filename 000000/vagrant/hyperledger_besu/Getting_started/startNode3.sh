#!/bin/sh

PROJECTROOT=~/IBFT-Network
NODEROOT=$PROJECTROOT/Node-3
nohup ~/besu/bin/besu --data-path=data --genesis-file=$PROJECTROOT/genesis.json --bootnodes=##ENODEURL## --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547 > $NODEROOT/node3.log 2>&1 &
