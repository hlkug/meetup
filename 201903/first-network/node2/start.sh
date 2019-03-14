#!/bin/bash


IMAGETAG="1.4.0"
COMPOSE_FILE=docker-compose-cli.yaml

../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_ID -asOrg Org2MSP
echo "Starting Fabric Network..."
COMPOSE_PROJECT_NAME=fabric IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE up
