if not Vagrant.has_plugin?("vagrant-vbguest")
  raise "vagrant-vbguest is required. Please run `vagrant plugin install vagrant-vbguest`"
end

Vagrant.configure("2") do |config|
  config.vm.box = "debian/jessie64"

  config.vm.synced_folder ".", "/vagrant", type: "virtualbox", mount_options: ["dmode=755,fmode=644"]

  config.vm.define "build" do |build|
    build.vm.provider "virtualbox" do |vb|
      vb.memory = 1024
    end

    build.vm.provision "shell" do |shell|
      shell.privileged = false
      shell.path = "build/provision.sh"
    end
  end

  config.vm.define "staging" do |staging|
    staging.vm.provider "virtualbox" do |vb|
      vb.memory = 512
      vb.cpus = 1
    end

    staging.vm.network "forwarded_port", guest: 80, host: 8000, host_ip: "localhost"
    # staging.vm.network "forwarded_port", guest: 443, host: 443, host_ip: "localhost"

    staging.vm.provision "shell" do |shell|
      shell.privileged = false
      shell.path = "staging/provision.sh"
    end
  end
end
