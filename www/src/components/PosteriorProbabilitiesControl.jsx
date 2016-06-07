import React from "react";

import {Menu, MenuItem, Paper} from "material-ui";

export class PosteriorProbabilitiesControl extends React.Component {
  constructor(props){
    super(props);

    this.showPostProbs = this.showPostProbs.bind(this);
    this.postProbsSetList = this.postProbsSetList.bind(this);
  }

  showPostProbs(id, index){
    console.log("showPostProbs:", id, index);
    this.props.setActivePosteriorProbability(id,index);
  }

  // RENDERING
  postProbsSetList(){
    const posteriorProbabilitiesMap = this.props.posteriorProbabilitiesMap;
    const postProbsSets = [...posteriorProbabilitiesMap.get("All").values()]
      .filter(ppSet => ppSet.type === "Run")
      .map(ppSet => (
        <a key={ppSet.id} className="collection-item black-text"
            onClick={()=>{this.showPostProbs(ppSet.id,0)}}>
          <strong>{ppSet.id}</strong><br/>
            Observation Set: {ppSet.observationSet.name}<br/>
            Run submitted: {ppSet.dateTime}
        </a>
      ));
    return postProbsSets;
  }
  render(){
    const emptySetPrompt = (
      <div className="collection-item center-align" style={{"paddingBottom":"0px", "paddingTop":"0px"}}>
        <span>No Posterior Probabilities To Show</span>
      </div>
    );
    const postProbsSetList = this.postProbsSetList();
    return (
      <div className="collection">
        {
          postProbsSetList.length===0 ? emptySetPrompt:postProbsSetList
        }
      </div>
    );
  }
}
