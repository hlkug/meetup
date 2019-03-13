#!/bin/bash


IMAGETAG="1.4.0"
COMPOSE_FILE=docker-compose-cli.yaml
CHANNEL_ID="mychannel"

echo "Starting Fabric Network..."
COMPOSE_PROJECT_NAME=fabric IMAGE_TAG=$IMAGETAG docker-compose -f $COMPOSE_FILE up
