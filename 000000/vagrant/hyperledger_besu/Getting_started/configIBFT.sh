#!/bin/sh

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


cd
mkdir scripts
cd scripts
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode1.sh
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode2.sh
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode3.sh
wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/vagrant/hyperledger_besu/Getting_started/startNode4.sh
