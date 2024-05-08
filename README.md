# APIGateway

## Overview
This README provides instructions on how to set up and run the APIGateway using Docker. This gateway acts as the central entry point to various services, routing requests and handling authentication.

## Prerequisites
Before you begin, make sure you have Docker installed on your machine. If you do not have Docker installed, you can download and install it from [Docker's official website](https://www.docker.com/get-started).

## Getting Started

### Step 1: Clone the Repository
To get started, clone this repository to your local machine using the following command:

```
git clone [repository-url]
cd APIGateway
```
Replace `[repository-url]` with the actual URL of the repository.

### Step 2: Create an .env File
Before running the Docker container, create an `.env` file in the root directory of the project with the following configuration:

```
PORT=8000
JWT_SECRET=your_jwt_secret
WORKORDER_CLIENT_URI=http://host.docker.internal:8001/graphql
USER_SERVICE_URL=http://host.docker.internal:4000/graphql
COMMUNICATION_SERVICE_URL=http://host.docker.internal:6000/graphql
MARKETPLACE_SERVICE_URL=http://host.docker.internal:7700/graphql
ROOM_BOOKING_SERVICE_URL=http://host.docker.internal:9000/graphql
```
Replace `your_jwt_secret` with your JWT secret key, and customize each service URL and port according to your network setup.

### Step 3: Make the Script Executable
Before running the script, ensure it is executable. Run the following command in your terminal:

```
chmod +x ./rebuild_and_run.sh
```

### Step 4: Run the Script
Once the script is executable, you can run it to rebuild and start the Docker container:


```
./rebuild_and_run.sh
```

## What Does the Script Do?
The `rebuild_and_run.sh` script performs the following actions:
1. Builds a new Docker image from the Dockerfile.
2. Stops any previously running containers of the APIGateway.
3. Starts a new container using the newly built image.
