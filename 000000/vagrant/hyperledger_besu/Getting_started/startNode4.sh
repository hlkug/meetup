#!/bin/sh

./besu/bin/besu --data-path=data --genesis-file=../genesis.json --bootnodes=<Node-1 Enode URL> --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548
