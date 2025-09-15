#!/bin/bash

echo "Starting Wool Market API Server..."
echo

cd server
echo "Installing dependencies..."
npm install

echo
echo "Starting server..."
npm start
