#!/bin/bash

# Name of Docker image
IMAGE_NAME="apigateway"

# Name of Docker container
CONTAINER_NAME="apigateway"

# Port mapping (host:container)
PORT_MAPPING="8000:2009"

# Path to .env file
ENV_FILE_PATH="./.env"

# Check if the container is already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

# Check if the container exists and remove it
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "Removing existing container..."
    docker rm $CONTAINER_NAME
fi

# Run a new container from the existing image
echo "Running new container..."
docker run --name $CONTAINER_NAME -p $PORT_MAPPING --env-file $ENV_FILE_PATH -d $IMAGE_NAME

echo "$CONTAINER_NAME has been successfully started."
