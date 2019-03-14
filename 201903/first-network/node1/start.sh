#!/bin/bash


IMAGETAG="1.4.0"
COMPOSE_FILE=docker-compose-cli.yaml
CHANNEL_ID="mychannel"

../bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
../bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/${CHANNEL_ID}.tx -channelID $CHANNEL_ID
../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_ID -asOrg Org1MSP

echo "Starting Fabric Network..."
COMPOSE_PROJECT_NAME=fabric IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE up
