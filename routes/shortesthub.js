// Require the necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const hubs = require('../Data/constants');

// Define a route for the POST request to pass hub information
router.post('/', (req, res) => {
  // Get the hub information from the request body
  console.log("insiddddddd")
  const hubs = req.body.hubs;
  console.log(hubs)
  
  // Convert the hub information to an adjacency matrix
  const adjMatrix = hubsToAdjMatrix(hubs);

  // Find the hub with the shortest average distance using the Floyd-Warshall algorithm
  const hub = findHubShortestDistance(adjMatrix);

  // Send the hub information back as the response
  res.send(`The hub with the shortest average distance is ${hubs[hub]}`);
});
// Function to convert hub information to an adjacency matrix
function hubsToAdjMatrix(hubs) {
  // Initialize the adjacency matrix
  const n = hubs.length;
  const adjMatrix = Array(n).fill().map(() => Array(n).fill(Infinity));
  
  // Set the diagonal elements to 0
  for (let i = 0; i < n; i++) {
    adjMatrix[i][i] = 0;
  }
  
  // Populate the adjacency matrix with the distances between hubs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const distance = calculateDistance(hubs[i], hubs[j]);
      adjMatrix[i][j] = distance;
      adjMatrix[j][i] = distance;
    }
  }
  console.log(adjMatrix)
  return adjMatrix;
}

// Function to calculate the distance between two hubs
function calculateDistance(hub1, hub2) {
  // Implement the distance calculation between the hubs

  hub1index = hubs.hubMap[hub1];
  hub2index = hubs.hubMap[hub2];
    console.log(hub1index)
  const distance = hubs.hubs[hub1index][hub2index];
  return distance;
}

// Function to find the hub with the shortest average distance using the Floyd-Warshall algorithm
function findHubShortestDistance(adjMatrix) {
  const n = adjMatrix.length;
  let dist = adjMatrix.slice();
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  let minAvgDistance = Number.POSITIVE_INFINITY;
  let hub = -1;
  for (let i = 0; i < n; i++) {
    let sum = dist[i].reduce((acc, val) => acc + val);
    let avgDistance = sum / (n - 1);
    if (avgDistance < minAvgDistance) {
      minAvgDistance = avgDistance;
      hub = i;
    }
  }
  return hub;
}

module.exports =router;

