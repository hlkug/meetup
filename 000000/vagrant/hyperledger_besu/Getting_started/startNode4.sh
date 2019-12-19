#!/bin/sh

PROJECTROOT=~/IBFT-Network
NODEROOT=$PROJECTROOT/Node-4
nohup ~/besu/bin/besu --data-path=data --genesis-file=$PROJECTROOT/genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548 > $NODEROOT/node4.log 2>&1 &
