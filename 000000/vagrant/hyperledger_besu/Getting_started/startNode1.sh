#!/bin/sh

./besu/bin/besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-whitelist="*" --rpc-http-cors-origins="all"
