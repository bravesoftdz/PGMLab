import React from "react";
import RunTypeSelect from "./RunTypeSelect.jsx";
import RunDataSelect from "./RunDataSelect.jsx";
import DataspaceControl from "./DataspaceControl.jsx"

export default class RunControlPanel extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="card-panel">
        <RunTypeSelect
            runType={this.props.runType}
            changeRunType = {this.props.changeRunType}
        />
        <RunDataSelect
            dataspace={this.props.dataspace}
            dataspaceModals = {this.props.dataspaceModals}
            toggleDataspaceModal = {this.props.toggleDataspaceModal}
            observations={this.props.observations}
            selectObservationSet = {this.props.selectObservationSet}
            selectObservation={this.props.selectObservation}
            pathways={this.props.pathways}
            selectPathway={this.props.selectPathway}
            getReactomePathway = {this.props.getReactomePathway}
        />
        <DataspaceControl
            dataspace={this.props.dataspace}
        />
      </div>
    )
  }
}
