import React from "react";
import GraphPanel from "./GraphPanel.jsx";
import RunControlPanel from "./RunControlPanel.jsx";

import RaisedButton from "material-ui/RaisedButton";

export default class RunView extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="row">
        <div className="col s4">
          <RunControlPanel
              dataspace={this.props.dataspace}
              observations={this.props.observations}
              selectObservationSet={this.props.selectObservationSet}
              selectObservation={this.props.selectObservation}
              pathways={this.props.pathways}
              selectPathway={this.props.selectPathway}
          />
        </div>
        <div className="col s8">
          <GraphPanel />
        </div>
      </div>
    );
  }
}
