import React from 'react'

//import {Settings} from './Settings.jsx'
import {ControlPanel} from './ControlPanel.jsx'

var graphvis = require('../bin/graphvis.js');
//var graph = require('../bin/graph.js');

export class Content extends React.Component {
    componentDidMount () {
        this.props.setActivePathway(this.props.activePathway, this);
    }
    render () {
        return (
            <div className="row">
                     
                 <ControlPanel pairwiseInteractions = {this.props.pairwiseInteractions} 
                               observeNode          = {this.props.observeNode}
                               removeObservedNode   = {this.props.removeObservedNode}
                               observedNodes        = {this.props.observedNodes}
                               runInference         = {this.props.runInference}
                               setNodeState         = {this.props.setNodeState}
                               activePathway        = {this.props.activePathway} />

                 <div className="col s9 m9 l9">
                      <div style={{width:"800px"}} id="chart"></div>
                 </div>
            </div>
        );
    }
}
