#!/usr/bin/bash
container_name=openseesl_tcl_visualization
if [[ $(docker ps -a | grep $container_name | awk '{print $1}') ]]; then
    docker stop $container_name
    docker rm $container_name
 fi

docker run -d -t --init \
  --hostname=docker-node-18 \
  --restart=unless-stopped \
  --ipc=host \
  --user="$(id -u):$(id -g)" \
  --volume="$(git rev-parse --show-toplevel):/home/coco/working_directory" \
  --volume="vscode-server:/root/.vscode-server/extensions" \
  --name=$container_name \
  --workdir="/home/coco/working_directory" \
  node:18.4.0-buster bash
