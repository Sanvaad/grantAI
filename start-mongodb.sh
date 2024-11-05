#!/bin/bash

# Create MongoDB data directory if it doesn't exist
mkdir -p ~/mongodb-data

# Start MongoDB with the specified data directory
mongod --dbpath ~/mongodb-data