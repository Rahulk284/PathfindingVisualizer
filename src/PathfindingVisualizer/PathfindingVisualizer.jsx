import React, { Component } from "react";
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar} from '../algorithms/astar'
import './PathfindingVisualzier.css';
import { horizontalMaze, verticalMaze, primsMaze } from "../algorithms/mazes";
import NewWalls from './images/NewWalls.gif'


const START_NODE_ROW = 12;
const START_NODE_COL = 16;
const END_NODE_ROW = 12;
const END_NODE_COL = 40;



export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            isRunning: false,
            startNodeRow: START_NODE_ROW,
            startNodeCol: START_NODE_COL,
            endNodeRow: END_NODE_ROW,
            endNodeCol: END_NODE_COL,
        };
    }

    componentDidMount() {
        this.resetGrid();
    }

    resetGrid() {
        const grid = getStartingGrid();
        this.clearGrid();
        this.clearMaze();
        const { startNodeRow, startNodeCol, endNodeRow, endNodeCol } = this.state;
        const resetStartNodeRow = START_NODE_ROW;
        const resetStartNodeCol = START_NODE_COL;
        const resetEndNodeRow = END_NODE_ROW;
        const resetEndNodeCol = END_NODE_COL;
        if (startNodeRow !== resetStartNodeRow || startNodeCol !== resetStartNodeCol || endNodeRow !== resetEndNodeRow || endNodeCol !== resetEndNodeCol) {
            grid[startNodeRow][startNodeCol].isStart = false;
            grid[endNodeRow][endNodeCol].isEnd = false;
            grid[resetStartNodeRow][resetStartNodeCol].isStart = true;
            grid[resetEndNodeRow][resetEndNodeCol].isEnd = true;
            this.setState({
                grid,
                startNodeRow: resetStartNodeRow,
                startNodeCol: resetStartNodeCol,
                endNodeRow: resetEndNodeRow,
                endNodeCol: resetEndNodeCol,
            });
        } 
        else {
            this.setState({ grid });
        }
    }

    clearGrid() {
        const { grid } = this.state;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const node = grid[row][col];
                const className = node.isStart
                ? 'node node-start'
                : node.isEnd
                ? 'node node-finish'
                : node.isWall
                ? 'node node-wall'
                : 'node';
                document.getElementById(`node-${node.row}-${node.col}`).className = className;
            }
        }
    }

    clearMaze() {
        const { grid } = this.state;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const node = grid[row][col];
                if (node.isWall) {
                    const className = 'node';
                    document.getElementById(`node-${node.row}-${node.col}`).className = className;
                }
            }
        }
    }

    clearWalls() {
        const { grid } = this.state;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const node = grid[row][col];
                if (node.isWall || node.isVisited) {
                    const className = node.isStart
                    ? 'node node-start'
                    : node.isEnd
                    ? 'node node-finish'
                    : 'node';
                    document.getElementById(`node-${node.row}-${node.col}`).className = className;
                    node.isWall = false;
                    node.isVisited = false;
                }
            }
        }
    }

    
    handleMouseDown(row, col) {
        if (this.isRunning) {
            return;
        }
        const { grid } = this.state;
        const node = grid[row][col];
        if (node.isStart) {
            this.setState({ mouseIsPressed: true, isStartNodeDragging: true });
        } else if (node.isEnd) {
            this.setState({ mouseIsPressed: true, isEndNodeDragging: true });
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true });
        }
    }
    
    handleMouseEnter(row, col) {
        if (this.isRunning) {
            return;
        }
        if (!this.state.mouseIsPressed) return;
        const { grid, isStartNodeDragging, isEndNodeDragging, startNodeRow, startNodeCol, endNodeRow, endNodeCol } = this.state;
        if (isStartNodeDragging) {
            const newGrid = getNewGridWithStartNodeMoved(grid, startNodeRow, startNodeCol, row, col);
            this.setState({ grid: newGrid, startNodeRow: row, startNodeCol: col });
        } else if (isEndNodeDragging) {
            const newGrid = getNewGridWithEndNodeMoved(grid, endNodeRow, endNodeCol, row, col);
            this.setState({ grid: newGrid, endNodeRow: row, endNodeCol: col });
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            this.setState({ grid: newGrid });
        }
    }
    
    handleMouseUp() {
        if (this.isRunning) {
            return;
        }
        this.setState({ mouseIsPressed: false, isStartNodeDragging: false, isEndNodeDragging: false });
    }
    
    
    animateVerticalMaze(modifiedGrid) {
        for (let i = 0; i < modifiedGrid.length; i++) {
            for (let j = 0; j < modifiedGrid[i].length; j++) {
                setTimeout(() => {
                    const node = modifiedGrid[i][j];
                    if (node.isWall) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
                    }
                }, 20 * (i + j));
            }
        }
    } 
    
    visualizeVerticalMaze() {
        if(this.isRunning === true) {
            return; 
        }
        this.clearWalls();
        const { grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol } = this.state;
        const modifiedGrid = verticalMaze(grid);
        modifiedGrid[startNodeRow][startNodeCol].isWall = false;
        modifiedGrid[endNodeRow][endNodeCol].isWall = false;
        this.animateVerticalMaze(modifiedGrid);
    }
    
    animateHorizontalMaze(modifiedGrid) {
        for (let i = 0; i < modifiedGrid.length; i++) {
            for (let j = 0; j < modifiedGrid[i].length; j++) {
                setTimeout(() => {
                    const node = modifiedGrid[i][j];
                    if (node.isWall) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
                    }
                }, 20 * (i + j));
            }
        }
    }

    visualizeHorizontalMaze() {
        if(this.isRunning === true) {
            return; 
        }
        this.clearWalls();
        const { grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol } = this.state;
        const modifiedGrid = horizontalMaze(grid);
        modifiedGrid[startNodeRow][startNodeCol].isWall = false;
        modifiedGrid[endNodeRow][endNodeCol].isWall = false;
        this.animateHorizontalMaze(modifiedGrid);
    }

    animatePrimsMaze(modifiedGrid) {
        for (let i = 0; i < modifiedGrid.length; i++) {
            for (let j = 0; j < modifiedGrid[i].length; j++) {
                setTimeout(() => {
                    const node = modifiedGrid[i][j];
                    if (node.isWall) {
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-wall';
                    }
                }, 20 * (i + j));
            }
        }
    }

    visualizePrimsMaze() {
        if(this.isRunning === true) {
            return;
        }
        this.clearWalls();
        const { grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol } = this.state;
        const startNode = grid[startNodeRow][startNodeCol];
        const endNode = grid[endNodeRow][endNodeCol];
        const modifiedGrid = primsMaze(grid, startNode, endNode);
        this.animatePrimsMaze(modifiedGrid)
    }

    animateDijkstra(nodesInOrder, shortestPath) {
        if (!this.isRunning) {
            this.isRunning = true;
            this.clearGrid();
            for (let i = 0; i <= nodesInOrder.length; i++) {
                if(i === nodesInOrder.length) {
                    setTimeout(() => {
                        this.isRunning = true;
                        this.animateShortestPath(shortestPath);
                    }, i * 8);
                    return;
                }
                setTimeout(() => {
                    this.isRunning = true;
                    const node = nodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited ';
                }, i * 8);
                if(i === nodesInOrder.length - 1) {
                    setTimeout(() => {
                        this.isRunning = false;
                    }, i * 8);
                }
            }
        }
    }
    
    visualizeDijkstra() {
        const {grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol} = this.state;
        const startNode = grid[startNodeRow][startNodeCol];
        const endNode = grid[endNodeRow][endNodeCol];
        grid[startNodeRow][startNodeCol].isWall = false;
        grid[endNodeRow][endNodeCol].isWall = false;
        const nodesInOrder = dijkstra(grid, startNode, endNode);
        const shortestPath = getNodesInShortestPathOrder(endNode);
        this.animateDijkstra(nodesInOrder, shortestPath);
        this.isRunning = false;
    }

    animateAstar(nodesInOrder, shortestPath) {
        if(!this.isRunning) {
            this.isRunning = true;
            this.clearGrid();
            for (let i = 0; i <= nodesInOrder.length; i++) {
                if(i === nodesInOrder.length) {
                    setTimeout(() => {
                        this.isRunning = true;
                        this.animateShortestPath(shortestPath);
                    }, i * 8);
                    return;
                }
                setTimeout(() => {
                    const node = nodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited ';
                }, i * 8);
                if(i === nodesInOrder.length - 1) {
                    setTimeout(() => {
                        this.isRunning = false;
                    }, i * 8);
                }
            }
        }
    }
    
    visualizeAstar() {
        const {grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol } = this.state;
        const startNode = grid[startNodeRow][startNodeCol];
        const endNode = grid[endNodeRow][endNodeCol];
        const nodesInOrder = astar(grid, startNode, endNode);
        const shortestPath = getNodesInShortestPathOrder(endNode);
        this.animateAstar(nodesInOrder, shortestPath);
    }


    animateShortestPath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
                const node = shortestPath[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }, 30 * i)
            if(i === shortestPath.length - 1) {
                setTimeout(() => {
                    this.isRunning = false;
                }, i * 30);
            }
        }
    }

    render() {
        const {grid, mouseIsPressed} = this.state;
        
        return (
            <>
                <nav className="buttons-wrapper">
                    <h1 className="title">Pathfinding Visualizer</h1>
                    <div className="algorithms">
                        <button onClick={() => this.visualizeDijkstra()}>
                            Visualize Dijkstra Algorithm
                        </button>
                        <button onClick={() => this.visualizeAstar()}>
                            Visualize A* Algorithm
                        </button>
                    </div>
                    <div className="mazes">
                        <button className = "maze" onClick={() => this.visualizePrimsMaze()}>
                            Prims Maze
                        </button>
                        <button className = "maze" onClick={() => this.visualizeVerticalMaze()}>
                            Vertical Maze
                        </button>
                        <button className = "maze" onClick={() => this.visualizeHorizontalMaze()}>
                            Horizontal Maze
                        </button>
                    </div>
                    <button className="reset" onClick={() => this.resetGrid()}>
                        Reset Board
                    </button>
                </nav>
                <div className="popup-container"> 
                    <div class="popup" onClick={() => myFunction()}>
                        <div class="popup-text" id="myPopup">
                            <p >
                                <h1>Welcome to my Pathfinding Visualizer!</h1>
                                <p style={{ fontSize: "14px", textAlign: "left" }}>
                                    This project visualizes two pathfinding algorithms: Dijkstra & A*. Click on either algorithm button to start the visualization and find the shortest path to the end node (red)!
                                </p>

                                <p style={{ fontSize: "14px", textAlign: "left" }}>
                                    You can click and drag the start node (green) or the end node (red) to wherever you want on the grid.
                                </p>

                                <p style={{ fontSize: "14px", textAlign: "left" }}>
                                    You can make more challenging paths by adding walls to the grid by clicking and dragging!
                                </p>
                                <img src={NewWalls} alt="NEW" width="115" height="115" style={{ textAlign: "center" }}></img>
                                <p style={{ fontSize: "14px", textAlign: "left" }}>
                                    This project also has three maze generators. The first maze button uses Prim's algorithm to generate an intricate and challenging maze. The last
                                    two mazes are simple mazes that do not use any complex algorithms (Vertical Maze & Horizontal Maze). Feel free to add extra walls to the mazes and make them
                                    even more challenging!
                                </p>
                                
                                <p style={{ fontSize: "20px"}}>Enjoy!</p>
                                <h6>click this page to exit</h6>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isStart, isEnd, isVisited, isWall} = node; 
                                    return (
                                        <Node 
                                        key={nodeIdx}
                                        row={row}
                                        col={col}
                                        isWall={isWall}
                                        isStart={isStart}
                                        isEnd = {isEnd} 
                                        isVisited = {isVisited}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) =>
                                            this.handleMouseEnter(row, col)
                                        }
                                        onMouseUp={() => this.handleMouseUp()}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const getStartingGrid = () => {
    const grid = [];
    for (let row = 0; row < 25; row++) {
        const currentRow = [];
        for (let col = 0; col < 57; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isEnd: row === END_NODE_ROW && col === END_NODE_COL,
        distance: Infinity,
        heuristic: 0,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };


const getNewGridWithStartNodeMoved = (grid, oldRow, oldCol, newRow, newCol) => {
  const newGrid = grid.slice();
  const oldStartNode = newGrid[oldRow][oldCol];
  const newStartNode = {
    ...oldStartNode,
    isStart: false,
  };
  const newStartNodeRow = newGrid[newRow];
  const newStartNodeCol = newStartNodeRow[newCol];
  const newStartNodeUpdated = {
    ...newStartNodeCol,
    isStart: true,
  };
  newGrid[oldRow][oldCol] = newStartNode;
  newGrid[newRow][newCol] = newStartNodeUpdated;
  return newGrid;
};

const getNewGridWithEndNodeMoved = (grid, oldRow, oldCol, newRow, newCol) => {
    const newGrid = grid.slice();
    const oldEndNode = newGrid[oldRow][oldCol];
    const newEndNode = {
        ...oldEndNode,
        isEnd: false,
    };
    const newEndNodeRow = newGrid[newRow];
    const newEndNodeCol = newEndNodeRow[newCol];
    const newEndNodeUpdated = {
        ...newEndNodeCol,
        isEnd: true,
    };
    newGrid[oldRow][oldCol] = newEndNode;
    newGrid[newRow][newCol] = newEndNodeUpdated;
    return newGrid;
};

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}