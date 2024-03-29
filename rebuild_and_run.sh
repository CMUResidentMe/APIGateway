#!/bin/bash

# Name of your Docker image
IMAGE_NAME="apigateway"

# Name of your Docker container
CONTAINER_NAME="apigateway"

# Port mapping (host:container)
PORT_MAPPING="3000:3000"

# Stop the currently running container
echo "Stopping existing container..."
docker stop $CONTAINER_NAME

# Remove the stopped container
echo "Removing existing container..."
docker rm $CONTAINER_NAME

# Rebuild the Docker image with no cache
echo "Building new Docker image..."
docker build -t $IMAGE_NAME . --no-cache

# Run a new container from the rebuilt image
echo "Running new container..."
docker run --name $CONTAINER_NAME -p $PORT_MAPPING $IMAGE_NAME
