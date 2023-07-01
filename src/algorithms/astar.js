//ASTAR ALGORITHM
export function astar(grid, startNode, endNode) {
    resetNodeProperties(grid);
    const orderedVisitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while(!!unvisitedNodes.length) {
        sortNodesByDistanceAndHeuristic(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) {
            orderedVisitedNodes.shift();
            return orderedVisitedNodes;
        }
        closestNode.isVisited = true;
        orderedVisitedNodes.push(closestNode);
        if (closestNode === endNode) {
            orderedVisitedNodes.shift(0);
            orderedVisitedNodes.pop();
            return orderedVisitedNodes;
        } 
        unvisitedNeighbors(closestNode, grid, endNode);
    }
}

function sortNodesByDistanceAndHeuristic(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => {
        const distanceA = nodeA.distance + nodeA.heuristic;
        const distanceB = nodeB.distance + nodeB.heuristic;
        return distanceA - distanceB;
    });
}


function manhattanDistance(node, endNode) {
    const dx = Math.abs(node.col - endNode.col);
    const dy = Math.abs(node.row - endNode.row);
    return dx + dy;
}

function unvisitedNeighbors(node, grid, endNode) {
    const unvisited = getUnvisitedNeighbors(node, grid, endNode);
    for(const neighbor of unvisited) {
        const neighborDistance = node.distance + 1;
        if(neighborDistance < neighbor.distance) {
            neighbor.distance = neighborDistance;
            neighbor.heuristic = manhattanDistance(neighbor, endNode)
            neighbor.previousNode = node; 
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

function resetNodeProperties(grid) {
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
        }
    }
}