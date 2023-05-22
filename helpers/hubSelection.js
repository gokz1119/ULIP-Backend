const jsgraphs = require("js-graph-algorithms");
const {
  distanceMatrix,
  distanceWeight,
  infraWeight,
} = require("../data/constants");

/**
 * A function that selects the best hub for a given set of spokes based on the minimization of the cost function
 * for the various potential hubs
 *
 * @param {Array} spokeIds An array of ids representing the id of the spokes of the various requests
 * @param {Array} cities An array of objects representing all the cities
 *
 * @returns {Object} An object that contains the details of the best hub
 */
function selectBestHub(spokeIds, cities) {
  let minCost = Infinity;
  let bestHub = null;

  cities.forEach((city) => {
    
    if (city.typeOfCity === "hub") {
      let graphNodeIds = new Array(...spokeIds);

      if (!graphNodeIds.includes(city._id)) {
        graphNodeIds.push(city._id);
      }
      // shipmentGraph is a jsgraph that will be used to calculate the minimum spanning distance
      let shipmentGraph = generateShipmentGraph(graphNodeIds);

      // Apply Kruskal's algorithm to find the minimum spanning tree and the minimum spanning distance
      let msd = normalizeMsd(getMinimumSpanningDistance(shipmentGraph));

      let hubCost = calculateHubCost(msd, city.infraIndex);
      console.log(city.name,msd, hubCost);

      if (hubCost < minCost) {
        minCost = hubCost;
        bestHub = city;
      }
    }
    
  });

  return bestHub;
}

/**
 * A function that generates a graph representing the spokes and one of the potential hubs as the nodes
 *
 * @param {Array} graphNodeIds An array of city IDs of the spokes and one of the potential hubs
 *
 * @returns {jsgraphs} A graph object with the graphNodeIds as the nodes and the distance between those nodes as the weights.
 */
function generateShipmentGraph(graphNodeIds) {
  let shipmentGraph = new jsgraphs.WeightedGraph(graphNodeIds.length);

  for (let i = 0; i < graphNodeIds.length - 1; i++) {
    for (let j = i + 1; j < graphNodeIds.length; j++) {
      shipmentGraph.addEdge(
        new jsgraphs.Edge(
          i,
          j,
          distanceMatrix[graphNodeIds[i]][graphNodeIds[j]]
        )
      );
    }
  }

  return shipmentGraph;
}

/**
 * A function that computes the minimum spanning distance using the Kruskal's algorithm
 *
 * @param {jsgraphs} graph A jsgraph for which the minimum spanning distance is to be calculated
 *
 * @returns {Number} The minimum spanning distance of the graph
 */
function getMinimumSpanningDistance(graph) {
  let msd = 0;

  let kruskal = new jsgraphs.KruskalMST(graph);
  let mst = kruskal.mst;

  for (let i = 0; i < mst.length; i++) {
    let e = mst[i];
    msd = msd + e.weight;
  }

  return msd;
}

/**
 * A function that computes the cost function, which is to be minimized in order to find the optimal hub
 *
 * @param {Number} msd A number representing the minimum spanning distance of the graph which contains the hub under consideration
 * @param {Number} infraIndex A number representing the pre-defined infrastructure index of the hub under consideration
 *
 * @returns {Number} The value of the cost function for the hub under consideration
 */
function calculateHubCost(msd, infraIndex) {
  let cost = distanceWeight * msd + infraWeight * infraIndex;

  return cost;
}

let minMsd = Infinity;
let maxMsd = -Infinity;

/**
 * A function that normalizes the value of the minimum spanning distance between 0 and 100
 * @param {Number} msd The minimum spanning distance of a graph
 * @returns The normalized value of the minimum spanning distance
 */
function normalizeMsd(msd) {
  minMsd = Math.min(minMsd, msd);
  maxMsd = Math.max(maxMsd, msd);
  
  const normalizedValue = (msd - minMsd) * (100 / (maxMsd - minMsd));
  if(!isFinite(normalizedValue))
    return 100
  
  return normalizedValue;
}

module.exports = selectBestHub;