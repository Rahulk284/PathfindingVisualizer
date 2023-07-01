export function verticalMaze(grid) {
    const newGrid = grid.slice();

    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i][0].isWall = true;
        newGrid[i][newGrid[0].length - 1].isWall = true;
    }

    for (let i = 0; i < newGrid[0].length; i++) {
        newGrid[0][i].isWall = true;
        newGrid[newGrid.length - 1][i].isWall = true;
    }

    for (let i = 2; i < newGrid[0].length; i += 2) {
        for (let j = 1; j < newGrid.length - 1; j++) {
            if (randomInt(0, 3) !== 2) {
                newGrid[j][i].isWall = true;
            }
        }
    }

    return newGrid;
}

export function horizontalMaze(grid) {
    const newGrid = grid.slice();

  for (let i = 0; i < newGrid.length; i++) {
    newGrid[i][0].isWall = true;
    newGrid[i][newGrid[0].length - 1].isWall = true;
  }

  for (let i = 0; i < newGrid[0].length; i++) {
    newGrid[0][i].isWall = true;
    newGrid[newGrid.length - 1][i].isWall = true;
  }

  for (let i = 2; i < newGrid.length - 1; i += 2) {
    for (let j = 1; j < newGrid[0].length - 1; j++) {
      if (randomInt(0, 3) !== 2 && !newGrid[i][j].isStart && !newGrid[i][j].isEnd) {
        newGrid[i][j].isWall = true;
      }
    }
  }

  return newGrid;
}

//PRIMS MAZE

export function primsMaze(grid, startingNode, endingNode, max = 100) {
    const newGrid = grid.slice();
    console.log(newGrid);
  
    // Initialize all cells as walls
    for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
                newGrid[i][j].isWall = true;
        }
    }

    startingNode.isWall = false;
    endingNode.isWall = false;
    
  
    const startRow = Math.floor(Math.random() * (newGrid.length - 2)) + 1;
    const startCol = Math.floor(Math.random() * (newGrid[0].length - 2)) + 1;
    const startNode = newGrid[startRow][startCol];
    startNode.isWall = false;
  
    const frontier = [];
    const visited = [];
  
    addToFrontier(startRow, startCol, newGrid, frontier);

    while (frontier.length > 0) {
        const randomIndex = Math.floor(Math.random() * frontier.length);
        const randomCell = frontier[randomIndex];
        const { row, col } = randomCell;
  
        randomCell.isWall = false;
  
        visited.push(randomCell);
  
        frontier.splice(randomIndex, 1);
  
        addToFrontier(row, col, newGrid, frontier);
  
        connectToVisited(randomCell, visited, newGrid);
  
        addExtraConnections(randomCell, newGrid);
    }
    
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i][0].isWall = true;
        newGrid[i][newGrid[0].length - 1].isWall = true;
    }
    
    for (let i = 0; i < newGrid[0].length; i++) {
        newGrid[0][i].isWall = true;
        newGrid[newGrid.length - 1][i].isWall = true;
    }

    const nodePath = pathCheck(newGrid, startingNode, endingNode);
    const isPath = nodePath.includes(endingNode);
    if(!isPath) {
        primsMaze(grid, startingNode, endingNode, max = 100)
    }

    return newGrid;
  }
  
function addToFrontier(row, col, grid, frontier) {
    const neighbors = [];
    if (row > 1) neighbors.push(grid[row - 2][col]);
    if (row < grid.length - 2) neighbors.push(grid[row + 2][col]);
    if (col > 1) neighbors.push(grid[row][col - 2]);
    if (col < grid[0].length - 2) neighbors.push(grid[row][col + 2]);
  
    for (const neighbor of neighbors) {
        if (neighbor.isWall) {
        frontier.push(neighbor);
        neighbor.isFrontier = true;
        }
    }
  }
  
function connectToVisited(cell, visited, grid) {
    const neighbors = [];
    const { row, col } = cell;
  
    if (row > 1) neighbors.push(grid[row - 2][col]);
    if (row < grid.length - 2) neighbors.push(grid[row + 2][col]);
    if (col > 1) neighbors.push(grid[row][col - 2]);
    if (col < grid[0].length - 2) neighbors.push(grid[row][col + 2]);
  
    const visitedNeighbors = neighbors.filter((neighbor) => !neighbor.isWall && visited.includes(neighbor));
  
    if (visitedNeighbors.length > 0) {
      const randomNeighbor = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)];
  
        if (row < randomNeighbor.row) {
            grid[row + 1][col].isWall = false;
        } 
        else if (row > randomNeighbor.row) {
            grid[row - 1][col].isWall = false;
        } 
        else if (col < randomNeighbor.col) {
            grid[row][col + 1].isWall = false;
        } 
        else if (col > randomNeighbor.col) {
            grid[row][col - 1].isWall = false;
        }
    }
}
  
function addExtraConnections(cell, grid) {
    const { row, col } = cell;
    const neighbors = [];
  
    if (row > 2) neighbors.push(grid[row - 2][col]);
    if (row < grid.length - 3) neighbors.push(grid[row + 2][col]);
    if (col > 2) neighbors.push(grid[row][col - 2]);
    if (col < grid[0].length - 3) neighbors.push(grid[row][col + 2]);
  
    for (const neighbor of neighbors) {
        if (neighbor.isWall) {
            neighbor.isWall = false;
        }
    }
}
    
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function pathCheck(grid, startNode, endNode) {
    resetNodeProperties(grid);
    const orderedVisitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    
    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return orderedVisitedNodes;
      
      closestNode.checkPath = true;
      orderedVisitedNodes.push(closestNode);
      
      if (closestNode === endNode) return orderedVisitedNodes;
      
      unvisitedNeighbors(closestNode, grid);
    }
    
    return orderedVisitedNodes;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function unvisitedNeighbors(node, grid) {
    const unvisited = getUnvisitedNeighbors(node, grid);
    for(const neighbor of unvisited) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
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

function resetNodeProperties(grid) {
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
        }
    }
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
