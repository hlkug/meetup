#!/bin/sh

PROJECTROOT=~/IBFT-Network
# configure IBFT Network
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/ibftConfigFile.json
mkdir -p IBFT-Network/Node-1/data
mkdir -p IBFT-Network/Node-2/data
mkdir -p IBFT-Network/Node-3/data
mkdir -p IBFT-Network/Node-4/data

cd IBFT-Network
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/ibftConfigFile.json

~/besu/bin/besu operator generate-blockchain-config --config-file=ibftConfigFile.json --to=networkFiles --private-key-file-name=key

cp ./networkFiles/genesis.json .

cd Node-1
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode1.sh
cd ../Node-2
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode2.sh
cd ../Node-3
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode3.sh
cd ../Node-4
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode4.sh

chmod +x $PROJECTROOT/Node-1/startNode1.sh
chmod +x $PROJECTROOT/Node-2/startNode2.sh
chmod +x $PROJECTROOT/Node-3/startNode3.sh
chmod +x $PROJECTROOT/Node-4/startNode4.sh

cd $PROJECTROOT/networkFiles/keys
cp ./$(ls | awk 'NR == 1')/* $PROJECTROOT/Node-1/data/
cp ./$(ls | awk 'NR == 2')/* $PROJECTROOT/Node-2/data/
cp ./$(ls | awk 'NR == 3')/* $PROJECTROOT/Node-3/data/
cp ./$(ls | awk 'NR == 4')/* $PROJECTROOT/Node-4/data/
