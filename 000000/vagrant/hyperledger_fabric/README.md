# Vagrant를 이용하여 하이퍼레저 패브릭 VM 구성하기

[TOC]

## 0. Vagrant?

Vagrant는 개발 환경을 구축하고 배포하기 위한 도구입니다.

Vagrant에서 관리하는 개발 환경은 VirtualBox 또는 VMware와 같은 로컬 가상화 플랫폼, AWS 또는 OpenStack을 통한 클라우드 또는 Docker 또는 원시 LXC와 같은 컨테이너에서 실행할 수 있습니다.

Vagrant는 완전한 휴대용 개발 환경을 만들고 관리하기 위한 프레임워크와 구성 형식을 제공합니다. 이러한 개발 환경은 컴퓨터나 클라우드에서 사용할 수 있으며, Windows, Mac OS X 및 Linux 간에 이동 가능합니다.

* https://www.vagrantup.com



## 1. VirtualBox 설치

아래 링크에서 본인 노트북 OS에 맞는 프로그램을 다운로드 받아 설치합니다.

- https://www.virtualbox.org/wiki/Downloads



## 2. Vagrant 설치

아래 링크에서 본인 노트북 OS에 맞는 프로그램을 다운로드 받아 설치합니다.

- https://www.vagrantup.com/downloads.html



## 3. Vagrant 설치 확인 및 플러그인 설치

정상적으로 설치가 되었는 지 버전 확인을 합니다. 2.x 버전을 권장합니다.

```shell
$ vagrant version
Installed Version: 2.2.5
Latest Version: 2.2.5
```

VM에 할당하는 디스크 용량을 지정하기 위해 vagrant-disksize 플러그인을 설치합니다.

기본적으로 10G가 할당되며 vagrant-disksize 플러그인을 통해서 10G이상 할당할 수 있습니다. 단, 줄일 수는 없습니다.

- https://github.com/sprotheroe/vagrant-disksize

```shell
$ vagrant plugin install vagrant-disksize
Installing the 'vagrant-disksize' plugin. This can take a few minutes...
Fetching: vagrant-disksize-0.1.3.gem (100%)
Installed the plugin 'vagrant-disksize (0.1.3)'!
```



## 4. Box(Image) 다운로드

Ubuntu 16.04 LTS Box(Image)를 다운 받습니다. Docker Container구동을 위해 Docker Image를 다운 받는것과 동일합니다.

```shell
$ vagrant box add ubuntu/xenial64
==> box: Loading metadata for box 'ubuntu/xenial64'
    box: URL: https://vagrantcloud.com/ubuntu/xenial64
==> box: Adding box 'ubuntu/xenial64' (v20190807.0.0) for provider: virtualbox
    box: Downloading: https://vagrantcloud.com/ubuntu/boxes/xenial64/versions/20190807.0.0/providers/virtualbox.box
    box: Download redirected to host: cloud-images.ubuntu.com
==> box: Successfully added box 'ubuntu/xenial64' (v20190807.0.0) for 'virtualbox'!

# Box(Image) 목록 확인
$ vargrant box list
ubuntu/xenial64 (virtualbox, 20190807.0.0)
```



## 5. Vagrantfile 다운로드

Vagrantfile에 VM 형식, 설정, 프로비전등을 설정하는 설정 파일입니다. (Dockerfile과 비슷하다고 보면 됩니다.)

아래 파일을 본인 노트북 특정 위치에 다운로드 받습니다. 

* https://github.com/hlkug/meetup/tree/master/000000/vagrant/hyperledger_fabric/Vagrantfile

* Vagrantfile 설명
  * VM 수: vm_num
  * VM 형식: config.vm.box
  * VM CPU(core수): node_cpu
  * VM 메모리(G): node_memroy
  * VM Network: node_network, 예> 10.10.10.0/24
  * VM 호스트명(Prefix): node_prefix + index, 예> node1, node2
  * VM IP: node_network + index, 예> 10.10.10.1, 10.10.10.2
  * VM 디스크: config.disksize.size, 10G이상만 가능합니다. 

아래는 1Core, 2G 메모리, 10G 디스크를 가지는 VM 한개를 생성하는 샘플 Vagrantfile입니다.

```ruby
ENV["LC_ALL"] = "en_US.UTF-8"

Vagrant.configure("2") do |config|
  vm_num = 1
  node_cpu = 1 # 1Core
  node_memory = "2048" # 2G Memory
  node_network = "10.10.10"
  node_prefix = "node"
  
  config.vm.box = "ubuntu/xenial64"
  config.vm.box_check_update = false
  config.disksize.size = "10GB" # > 10GB

  (1..vm_num).each do |i|
    config.vm.define "#{node_prefix}#{i}" do |node|
      hostname = "#{node_prefix}#{i}"
      hostip = "#{node_network}.#{i + 1}"

      node.vm.hostname = hostname
      node.vm.network "private_network", ip: hostip

      node.vm.provider "virtualbox" do |vb|
        vb.name = "#{node_prefix}#{i}"
        vb.gui = false
        vb.cpus = node_cpu
        vb.memory = node_memory
      end
    end
  end

  config.vm.provision "shell", inline: <<-EOF
    	apt-get update
      	apt-get upgrade

    	# Install Go
    	wget https://dl.google.com/go/go1.12.7.linux-amd64.tar.gz
            tar zxf go1.12.7.linux-amd64.tar.gz
            mv go /usr/local
            rm go1.12.7.linux-amd64.tar.gz

    	# Install Docker
            apt-get -y install apt-transport-https ca-certificates curl software-properties-common
    	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    	add-apt-repository \
    	   "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    	apt-get update
    	apt-get -y install docker-ce
            usermod -aG docker vagrant

    	# Install Docker Compose
    	curl -L https://github.com/docker/compose/releases/download/1.24.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    	chmod +x /usr/local/bin/docker-compose
            echo "PATH=$PATH:/usr/local/go/bin" >> /etc/profile
    	
    	# Install Hyperledger Fabric Samples, Binaries and Docker Images
            curl -sSL http://bit.ly/2ysbOFE | bash -s -- 1.4.2 1.4.2 0.4.15
    	chown -R vagrant:vagrant fabric-samples
  EOF
end
```



## 6. VM(Guest Machine) 생성

Vagrantfile을 기반으로 VM(Guest Machine)을 생성합니다. VM 생성 중 Hyperledger Fabric 1.4.2 에 포함된 fabric-samples 구동을 위한 환경까지 설정됩니다. VM생성시 몇분이 소요됩니다. 

* Go, Docker, Docker Compose, Hyperledger Fabric Docker Image & Sample(1.4.2) 설치

```shell
$ ls 
Vagrantfile
$ vagrant up
Bringing machine 'node1' up with 'virtualbox' provider...
==> node1: Importing base box 'ubuntu/xenial64'...
==> node1: Matching MAC address for NAT networking...
==> node1: Setting the name of the VM: node1
==> node1: Clearing any previously set network interfaces...
==> node1: Preparing network interfaces based on configuration...
    node1: Adapter 1: nat
    node1: Adapter 2: hostonly
==> node1: Forwarding ports...
    node1: 22 (guest) => 2222 (host) (adapter 1)
==> node1: Running 'pre-boot' VM customizations...
==> node1: Booting VM...
==> node1: Waiting for machine to boot. This may take a few minutes...
    node1: SSH address: 127.0.0.1:2222
...
node1: ===> List out hyperledger docker images
    node1: hyperledger/fabric-javaenv     1.4.2               1cd707531ce7        3 weeks ago         1.76GB
    node1: hyperledger/fabric-javaenv     latest              1cd707531ce7        3 weeks ago         1.76GB
    node1: hyperledger/fabric-ca          1.4.2               f289675c9874        3 weeks ago         253MB
    node1: hyperledger/fabric-ca          latest              f289675c9874        3 weeks ago         253MB
    node1: hyperledger/fabric-tools       1.4.2               0abc124a9400        3 weeks ago         1.55GB
    node1: hyperledger/fabric-tools       latest              0abc124a9400        3 weeks ago         1.55GB
    node1: hyperledger/fabric-ccenv       1.4.2               fc0f502399a6        3 weeks ago         1.43GB
    node1: hyperledger/fabric-ccenv       latest              fc0f502399a6        3 weeks ago         1.43GB
    node1: hyperledger/fabric-orderer     1.4.2               362021998003        3 weeks ago         173MB
    node1: hyperledger/fabric-orderer     latest              362021998003        3 weeks ago         173MB
    node1: hyperledger/fabric-peer        1.4.2               d79f2f4f3257        3 weeks ago         178MB
    node1: hyperledger/fabric-peer        latest              d79f2f4f3257        3 weeks ago         178MB
    node1: hyperledger/fabric-zookeeper   0.4.15              20c6045930c8        4 months ago        1.43GB
    node1: hyperledger/fabric-zookeeper   latest              20c6045930c8        4 months ago        1.43GB
    node1: hyperledger/fabric-kafka       0.4.15              b4ab82bbaf2f        4 months ago        1.44GB
    node1: hyperledger/fabric-kafka       latest              b4ab82bbaf2f        4 months ago        1.44GB
    node1: hyperledger/fabric-couchdb     0.4.15              8de128a55539        4 months ago        1.5GB
    node1: hyperledger/fabric-couchdb     latest              8de128a55539        4 months ago        1.5GB
    
# VM 상태 확인
$ vagrant status
Current machine states:

node1                     running (virtualbox)

The VM is running. To stop this VM, you can run `vagrant halt` to
shut it down forcefully, or you can run `vagrant suspend` to simply
suspend the virtual machine. In either case, to restart it again,
simply run `vagrant up`.
```



## 7. VM(Guest Machine) 접속

```shell
$ vagrant ssh node1
Welcome to Ubuntu 16.04.6 LTS (GNU/Linux 4.4.0-157-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

8 packages can be updated.
0 updates are security updates.

New release '18.04.2 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


vagrant@node1:~$ ls
fabric-samples
vagrant@node1:~$ exit

$
```



## 8. VM(Guest Machine) 중지

```shell
$ vagrant halt node1
==> node1: Attempting graceful shutdown of VM...

$ vagrant status
Current machine states:

node1                     poweroff (virtualbox)

The VM is powered off. To restart the VM, simply run `vagrant up`
```



## 9. VM(Guest Machine) 재시작

```shell
$ vagrant up node1
Bringing machine 'node1' up with 'virtualbox' provider...
==> node1: Clearing any previously set forwarded ports...
==> node1: Clearing any previously set network interfaces...
==> node1: Preparing network interfaces based on configuration...
    node1: Adapter 1: nat
    node1: Adapter 2: hostonly
==> node1: Forwarding ports...
    node1: 22 (guest) => 2222 (host) (adapter 1)
==> node1: Running 'pre-boot' VM customizations...
==> node1: Booting VM...
==> node1: Waiting for machine to boot. This may take a few minutes...
    node1: SSH address: 127.0.0.1:2222
    node1: SSH username: vagrant
    node1: SSH auth method: private key
==> node1: Machine booted and ready!
==> node1: Checking for guest additions in VM...
    node1: The guest additions on this VM do not match the installed version of
    node1: VirtualBox! In most cases this is fine, but in rare cases it can
    node1: prevent things such as shared folders from working properly. If you see
    node1: shared folder errors, please make sure the guest additions within the
    node1: virtual machine match the version of VirtualBox you have installed on
    node1: your host and reload your VM.
    node1:
    node1: Guest Additions Version: 5.1.38
    node1: VirtualBox Version: 6.0
==> node1: Setting hostname...
==> node1: Configuring and enabling network interfaces...
==> node1: Mounting shared folders...
    node1: /vagrant => /Users/yunho.chung/Vagrant/fabric
==> node1: Machine already provisioned. Run `vagrant provision` or use the `--provision`
==> node1: flag to force provisioning. Provisioners marked to run always will still run.

$ vagrant status
Current machine states:

node1                     running (virtualbox)

The VM is running. To stop this VM, you can run `vagrant halt` to
shut it down forcefully, or you can run `vagrant suspend` to simply
suspend the virtual machine. In either case, to restart it again,
simply run `vagrant up`.
```



## 10. VM(Guest Machine) 삭제

```shell
$ vagrant destroy node1
    node1: Are you sure you want to destroy the 'node1' VM? [y/N] y
==> node1: Forcing shutdown of VM...
==> node1: Destroying VM and associated drives...

$ vagrant status
Current machine states:

node1                     not created (virtualbox)

The environment has not yet been created. Run `vagrant up` to
create the environment. If a machine is not created, only the
default provider will be shown. So if a provider is not listed,
then the machine is not created for that environment.
```

