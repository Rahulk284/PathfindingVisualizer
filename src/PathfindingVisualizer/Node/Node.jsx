import React, {Component} from "react";

import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {isEnd, isStart, isVisited, onMouseDown, onMouseUp, onMouseEnter, row, col, isWall,} = this.props; 
        const extraClassName = isEnd 
            ? 'node-finish' 
            : isStart 
            ? 'node-start' 
            : isWall
            ? 'node-wall'
            :isVisited
            ? 'node-visited'
            : '';
            

        return (
            <div 
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}></div>
        );
    }
}


