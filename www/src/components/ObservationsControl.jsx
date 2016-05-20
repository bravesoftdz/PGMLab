import React from 'react'

import {NodeItem} from "./NodeItem.jsx";
import {ObservedNodeList} from './ObservedNodeList.jsx';

import {SelectPathways} from './SelectPathways.jsx'
import {SelectedPathways} from './SelectedPathways.jsx'
import {SelectObservation} from './SelectObservation.jsx'

var classNames = require("classnames");

export class ObservationsControl extends React.Component {
  constructor(props){
    super(props);
    this.state = {value:0};

    this.shiftActiveObservation = this.shiftActiveObservation.bind(this);
    this.header = this.header.bind(this);
    this.nodeList = this.nodeList.bind(this);
  }
  shiftActiveObservation(shift){
    const direction = (distance)=>{
      switch (shift) {
        case "left": return distance < 0;
        case "right": return distance > 0;
      };
    };
    const selectedObservations = this.props.selectedObservations.get(this.props.runType);
    const currentActivatedIndex = selectedObservations.get("Active");
    const nextActivated = selectedObservations.get("Indices").reduce((best,index)=>{
      const distance = index-currentActivatedIndex;
      const correctDirection = direction(distance);
      const closer = Math.abs(distance) < Math.abs(best.distance);
      switch (correctDirection && closer) {
        case true: return {index,distance};
        default: return best;
      };
    }, {index:currentActivatedIndex,distance:Infinity});
    console.log(nextActivated, selectedObservations.get("Indices"));
    switch (nextActivated.distance === Infinity) {
      case true:
        return;
      default: this.props.setActiveObservation(nextActivated.index, this.props.runType);
    };
  }
  header(){
    const selectedObservationSet = this.props.selectedObservationSet.get(this.props.runType);
    const currentActivatedIndex = this.props.selectedObservations.get(this.props.runType).get("Active");
    const activeObservation = selectedObservationSet.observations[currentActivatedIndex];
    // console.log(activeObservation, currentActivatedIndex);
    return (
      <ul className="pagination">
        <li className="waves-effect blue lighten-5" onClick={()=>{this.shiftActiveObservation("left")}}>
          <a><i className="material-icons">chevron_left</i></a>
        </li>
        <li className="waves-effect blue lighten-5" onClick={()=>{this.shiftActiveObservation("right")}}>
          <a><i className="material-icons">chevron_right</i></a>
        </li>
        <li><a><i className="material-icons">search</i></a></li>
        <li><strong>{"Observation ".concat(currentActivatedIndex.toString())}</strong></li>
      </ul>
    );
  }
  nodeList(){
    const selectedObservationSet = this.props.selectedObservationSet.get(this.props.runType);
    const currentActivatedIndex = this.props.selectedObservations.get(this.props.runType).get("Active");
    const activeObservation = selectedObservationSet.observations[currentActivatedIndex] ? selectedObservationSet.observations[currentActivatedIndex] : []; //until we get init/example data
    const nodes = activeObservation.map((node)=>{
      return <NodeItem key={node.name} node={node}/>
    })
    return nodes;
  }
  render(){
    console.log(this.props);
    return (
      <div className="section">
        <h5>Active Observation</h5>
        {this.header()}
        <div className="collection">
          <div className="collection-item">
            <input type="text" placeholder="Type to filter nodes"/>
          </div>
          {this.nodeList()}
        </div>
      </div>
    );
  }
}
