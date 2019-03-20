#!/bin/sh

. ./env.sh

CHANNEL_NAME="mychannel"
CORE_PEER_LOCALMSPID="Org1MSP"
VERSION="1.0"
LANGUAGE="golang"
CC_SRC_PATH="github.com/chaincode/chaincode_example02/go/"

echo "Creating channel..."
setGlobals 0 1
set -x
####
set +x

echo "Having all peers for org1 join the channel..."
setGlobals 0 1
set -x
####
set +x

setGlobals 1 1
set -x
####
set +x

echo "Updating anchor peers for org1..."
setGlobals 0 1
set -x
####
set +x

echo "Installing chaincode on peer0.org1..."
setGlobals 0 1
set -x
####
set +x
sleep 3

echo "Installing chaincode on peer1.org1..."
setGlobals 1 1
set -x
####
set +x
sleep 3

echo "Instantiating chaincode on peer0.org1..."
setGlobals 0 1
set -x
####
set +x
sleep 3

echo "Querying chaincode on peer1.org1..."
setGlobals 1 1
set -x
####
set +x
