#!/bin/sh

. ./env.sh

CHANNEL_NAME="mychannel"
CORE_PEER_LOCALMSPID="Org2MSP"
VERSION="1.0"
LANGUAGE="golang"
CC_SRC_PATH="github.com/chaincode/chaincode_example02/go/"

echo "Having all peers for org2 join the channel..."
setGlobals 0 2
set -x
####
set +x

setGlobals 1 2
set -x
####
set +x

echo "Updating anchor peers for org2..."
setGlobals 0 2
set -x
####
set +x

echo "Installing chaincode on peer0.org2..."
setGlobals 0 2
set -x
####
set +x
sleep 1

echo "Installing chaincode on peer1.org2..."
setGlobals 1 2
set -x
####
set +x
sleep 1


echo "Querying chaincode on peer0.org2..."
setGlobals 0 2
set -x
####
set +x
sleep 3

echo "Querying chaincode on peer1.org2..."
setGlobals 1 2
set -x
####
set +x

