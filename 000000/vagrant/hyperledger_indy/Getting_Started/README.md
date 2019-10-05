# Vagrant를 이용하여 Hyperledger Indy - Getting Started 환경 구성하기

[TOC]

## 0. Vagrant?

Vagrant는 개발 환경을 구축하고 배포하기 위한 도구입니다.

Vagrant에서 관리하는 개발 환경은 VirtualBox 또는 VMware와 같은 로컬 가상화 플랫폼, AWS 또는 OpenStack을 통한 클라우드 또는 Docker 또는 원시 LXC와 같은 컨테이너에서 실행할 수 있습니다.

Vagrant는 완전한 휴대용 개발 환경을 만들고 관리하기 위한 프레임워크와 구성 형식을 제공합니다. 이러한 개발 환경은 컴퓨터나 클라우드에서 사용할 수 있으며, Windows, Mac OS X 및 Linux 간에 이동 가능합니다.

* https://www.vagrantup.com



## 1. VirtualBox 설치

아래 링크에서 본인 노트북 OS에 맞는 프로그램을 다운로드 받아 설치합니다.

- https://www.virtualbox.org/wiki/Downloads
- Windows 10 환경에 설치 시 Hyper-V 비활성화 작업 및 VirtualBox Extension Pack설치 등을 해야 합니다.
  - 참고 문서 - https://webnautes.tistory.com/448



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

기본적으로 10G이상이 자동적으로 할당되며 vagrant-disksize 플러그인을 통해서 임의의 디스크 용량을 할당할 수 있습니다. 단, 줄일 수는 없습니다.

- https://github.com/sprotheroe/vagrant-disksize

```shell
$ vagrant plugin install vagrant-disksize
Installing the 'vagrant-disksize' plugin. This can take a few minutes...
Fetching: vagrant-disksize-0.1.3.gem (100%)
Installed the plugin 'vagrant-disksize (0.1.3)'!
```

 

<u>**※ VMWare가 이미 설치되어있는 경우 vagrant 명령어에 --provider virtualbox 옵션을 추가해야 합니다.**</u> 

예> $ vagrant box add **<u>*--provider virtualbox*</u>** ubuntu/xenial64

## 4. Box(Image) 다운로드

Ubuntu 16.04 LTS Box(Image)를 다운 받습니다. Docker Container구동을 위해 Docker Image를 다운 받는것과 동일합니다.

```shell
$ vagrant box add --provider virtualbox ubuntu/xenial64
==> box: Loading metadata for box 'ubuntu/xenial64'
    box: URL: https://vagrantcloud.com/ubuntu/xenial64
==> box: Adding box 'ubuntu/xenial64' (v20191002.1.0) for provider: virtualbox
    box: Downloading: https://vagrantcloud.com/ubuntu/boxes/xenial64/versions/20191002.1.0/providers/virtualbox.box
    box: Download redirected to host: cloud-images.ubuntu.com
==> box: Successfully added box 'ubuntu/xenial64' (v20191002.1.0) for 'virtualbox'!

# Box(Image) 목록 확인
$ vagrant box list
ubuntu/xenial64    (virtualbox, 20191002.1.0)
```



## 5. Vagrantfile 다운로드

Vagrantfile에 VM 형식, 설정, 프로비전등을 설정하는 설정 파일입니다. (Dockerfile과 비슷하다고 보면 됩니다.)

아래 파일을 본인 노트북 특정 위치에 다운로드 받습니다. 

* <u>***본 가이드에서는 Hyperledger Indy SDK 1.11.x 의 Getting Started 설치를 대상으로 설명합니다.***</u> 
* Vagrantfile
  * https://github.com/hlkug/meetup/tree/master/000000/vagrant/hyperledger_indy/Getting_Started/Vagrantfile
* Vagrantfile 설명
  * VM 수: vm_num
  * VM 형식: config.vm.box
  * VM CPU(core수): node_cpu
  * VM 메모리(G): node_memroy
  * VM Network: node_network, 예> 10.10.10.0/24
  * VM 호스트명(Prefix): node_prefix + index, 예> node1-1, node1-2
  * VM IP: node_network + index, 예> 10.10.10.1, 10.10.10.2
  * VM 디스크: config.disksize.size, 10G이상만 가능합니다. 

아래는 1Core, 2G 메모리 VM 한개를 생성하는 샘플 Vagrantfile입니다.(Hyperledger Indy SDI 1.11.x)

```ruby
ENV["LC_ALL"] = "en_US.UTF-8"

Vagrant.configure("2") do |config|
  vm_num = 1
  node_cpu = 1 # 1Core
  node_memory = "2048" # 2G Memory
  node_network = "10.30.30"
  node_prefix = "indy"
  
  config.vm.box = "ubuntu/xenial64"
  config.vm.box_check_update = false
  #config.disksize.size = "10GB" # > 10GB

  (1..vm_num).each do |i|
    config.vm.define "#{node_prefix}-#{i}" do |node|
      hostname = "#{node_prefix}-#{i}"
      hostip = "#{node_network}.#{i + 1}"

      node.vm.hostname = hostname
      node.vm.network "private_network", ip: hostip

      node.vm.provider "virtualbox" do |vb|
        vb.name = "#{node_prefix}-#{i}"
        vb.gui = false
        vb.cpus = node_cpu
        vb.memory = node_memory
      end
    end
  end

  config.vm.provision "shell", inline: <<-EOF
        cd /etc/apt
        mv sources.list sources.list-
        wget https://raw.githubusercontent.com/hlkug/meetup/master/000000/ubuntu/16.04/sources.list
        cp sources.list /tmp

    	apt-get update
      	apt-get upgrade

    	# Install Go
    	wget https://dl.google.com/go/go1.12.10.linux-amd64.tar.gz
        tar zxf go1.12.10.linux-amd64.tar.gz
        mv go /usr/local
        rm go1.12.10.linux-amd64.tar.gz

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

	# Install Indy
        cd /home/vagrant
        git clone -b v1.11.1 https://github.com/hyperledger/indy-sdk.git

        cd indy-sdk/ci
        cp /tmp/sources.list .
        sed -i -e 's/1.9.2~dev871/1.10.0~dev916/g' \
            -e 's/1.9.2~dev1061/1.10.0~dev1095/g' \
            -e 's/127.0.0.1/10.0.0.2/g' indy-pool.dockerfile

        sed -i '2i COPY sources.list /etc/apt' indy-pool.dockerfile
        sed -i '3i RUN ln -s /usr/lib/apt/methods/http /usr/lib/apt/methods/https' indy-pool.dockerfile
        docker build -t indy_pool -f indy-pool.dockerfile .

        cd /home/vagrant/indy-sdk/docs/getting-started
        cp /tmp/sources.list .
        sed -i '2i COPY sources.list /etc/apt' getting-started.dockerfile
        sed -i '3i RUN ln -s /usr/lib/apt/methods/http /usr/lib/apt/methods/https' getting-started.dockerfile
        docker build -t getting-started -f getting-started.dockerfile .
        chown -R vagrant:vagrant /home/vagrant/indy-sdk
  EOF
end
```



## 6. VM(Guest Machine) 생성

Vagrantfile을 기반으로 VM(Guest Machine)을 생성합니다. VM 생성 중 Hyperledger Indy SDK에 포함된 Getting Started 구동을 위한 환경까지 설정됩니다. VM생성시 몇분이 소요됩니다. 

* Go, Docker, Docker Compose, Hyperledger Indy SDK & Docker Image for Getting Started 설치

```shell
$ ls 
Vagrantfile
$ vagrant up
Bringing machine 'indy-1' up with 'virtualbox' provider...
==> indy-1: Importing base box 'ubuntu/xenial64'...
==> indy-1: Matching MAC address for NAT networking...
==> indy-1: Setting the name of the VM: indy-1
==> indy-1: Clearing any previously set network interfaces...
==> indy-1: Preparing network interfaces based on configuration...
    indy-1: Adapter 1: nat
    indy-1: Adapter 2: hostonly
==> indy-1: Forwarding ports...
    indy-1: 22 (guest) => 2222 (host) (adapter 1)
==> indy-1: Running 'pre-boot' VM customizations...
==> indy-1: Booting VM...
==> indy-1: Waiting for machine to boot. This may take a few minutes...
    indy-1: SSH address: 127.0.0.1:2222
    indy-1: SSH username: vagrant
    indy-1: SSH auth method: private key
...
    indy-1: Step 9/10 : USER indy
    indy-1:  ---> Running in 11ed0f7d1c59
    indy-1: Removing intermediate container 11ed0f7d1c59
    indy-1:  ---> 1e13a6fbf763
    indy-1: Step 10/10 : EXPOSE 8888
    indy-1:  ---> Running in ec2c3cad373d
    indy-1: Removing intermediate container ec2c3cad373d
    indy-1:  ---> e5d164e57e19
    indy-1: Successfully built e5d164e57e19
    indy-1: Successfully tagged getting-started:latest
    
# VM 상태 확인
$ vagrant status
Current machine states:

indy-1                    running (virtualbox)

The VM is running. To stop this VM, you can run `vagrant halt` to
shut it down forcefully, or you can run `vagrant suspend` to simply
suspend the virtual machine. In either case, to restart it again,
simply run `vagrant up`.
```



## 7. VM(Guest Machine) 접속

**<u>Vagrant를 통한 VM 제어(접속, 시작, 종료, 삭제 등..)는 VM 생성 시에 사용되었던 Vagrantfile이 저장된 디렉토리에서 진행해야 합니다.</u>**

```shell
$ vagrant ssh indy-1
Welcome to Ubuntu 16.04.6 LTS (GNU/Linux 4.4.0-165-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

2 packages can be updated.
1 update is a security update.

New release '18.04.2 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


vagrant@indy-1:~$ ls
indy-sdk

vagrant@indy-1:~$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
getting-started     latest              e5d164e57e19        About a minute ago   715MB
indy_pool           latest              f331ad3ae288        14 minutes ago       682MB
ubuntu              16.04               657d80a6401d        2 weeks ago          121MB

vagrant@indy-1:~$ exit

$
```



## 8. VM(Guest Machine) 중지

**<u>VM을 삭제하면 VM을 새로 생성(vagrant up)할 때 시간이 많이 소요됩니다. 원활한 실습을 위해 VM 중지 & 재시작 명령어를 사용하시기 바랍니다.</u>**

```shell
$ vagrant halt indy-1
==> indy-1: Attempting graceful shutdown of VM...

$ vagrant status
Current machine states:

indy-1                    poweroff (virtualbox)

The VM is powered off. To restart the VM, simply run `vagrant up`
```



## 9. VM(Guest Machine) 재시작

```shell
$ vagrant up indy-1
Bringing machine 'indy-1' up with 'virtualbox' provider...
==> indy-1: Clearing any previously set forwarded ports...
==> indy-1: Clearing any previously set network interfaces...
==> indy-1: Preparing network interfaces based on configuration...
    indy-1: Adapter 1: nat
    indy-1: Adapter 2: hostonly
==> indy-1: Forwarding ports...
    indy-1: 22 (guest) => 2222 (host) (adapter 1)
==> indy-1: Running 'pre-boot' VM customizations...
==> indy-1: Booting VM...
==> indy-1: Waiting for machine to boot. This may take a few minutes...
    indy-1: SSH address: 127.0.0.1:2222
    indy-1: SSH username: vagrant
    indy-1: SSH auth method: private key
==> indy-1: Machine booted and ready!
==> indy-1: Checking for guest additions in VM...
    indy-1: The guest additions on this VM do not match the installed version of
    indy-1: VirtualBox! In most cases this is fine, but in rare cases it can
    indy-1: prevent things such as shared folders from working properly. If you see
    indy-1: shared folder errors, please make sure the guest additions within the
    indy-1: virtual machine match the version of VirtualBox you have installed on
    indy-1: your host and reload your VM.
    indy-1:
    indy-1: Guest Additions Version: 5.1.38
    indy-1: VirtualBox Version: 6.0
==> indy-1: Setting hostname...
==> indy-1: Configuring and enabling network interfaces...
==> indy-1: Mounting shared folders...
    indy-1: /vagrant => /Users/yunho.chung/Vagrant/indy
==> indy-1: Machine already provisioned. Run `vagrant provision` or use the `--provision`
==> indy-1: flag to force provisioning. Provisioners marked to run always will still run.

$ vagrant status
Current machine states:

indy-1                    running (virtualbox)

The VM is running. To stop this VM, you can run `vagrant halt` to
shut it down forcefully, or you can run `vagrant suspend` to simply
suspend the virtual machine. In either case, to restart it again,
simply run `vagrant up`.
```



## 10. VM(Guest Machine) 삭제

**<u>VM을 삭제하면 VM을 새로 생성(vagrant up)할 때 시간이 많이 소요됩니다. 실습이 종료된 후 삭제하시면 됩니다.</u>**

```shell
$ vagrant destroy indy-1
    indy-1: Are you sure you want to destroy the 'indy-1' VM? [y/N] y
==> indy-1: Forcing shutdown of VM...
==> indy-1: Destroying VM and associated drives...

$ vagrant status
Current machine states:

indy-1                    not created (virtualbox)

The environment has not yet been created. Run `vagrant up` to
create the environment. If a machine is not created, only the
default provider will be shown. So if a provider is not listed,
then the machine is not created for that environment.
```

