import React from "react";

import {Divider, FlatButton, Popover, Menu, MenuItem, FontIcon} from "material-ui";

var classNames = require("classnames");
var graphvis = require("./../../lib/graphvis.js");

export class NodeItem extends React.Component {
  constructor(props){
    super(props);
    this.state={
      open:false,
      nodeStates: [
        {val:"-",label:"Unobserved"},
        {val:"1",label:"1 | Down regulated"},
        {val:"2",label:"2 | Unchanged"},
        {val:"3",label:"3 | Up regulated"}
      ]
    };

    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleNodeState = this.handleNodeState.bind(this);
    this.handleNodeFocus = this.handleNodeFocus.bind(this);
    this.handleUnfocusAll = this.handleUnfocusAll.bind(this);

    this.stateMenuItem = this.stateMenuItem.bind(this);
    this.focusMenuItem = this.focusMenuItem.bind(this);
  }
  handleTouchTap(event){
    this.setState({open:true,
      anchorEl:event.currentTarget
    });
  }
  handleRequestClose(){
    this.setState({open:false});
  }
  handleNodeState(newState){
    if (`${newState}` !== this.props.nodeState) {
      this.props.setNodeItemState(this.props.node.name, `${newState}`);
    };
    this.handleRequestClose();
  }
  handleNodeFocus(){
    // graphvis.handleNodeFocus(this.props.node);
    this.props.handleNodeFocus(this.props.node);
    this.handleRequestClose();
  }
  handleUnfocusAll(){
    this.props.handleUnfocusAll();
    this.handleRequestClose();
  }

  // RENDERING
  stateMenuItem(){
    const header = <MenuItem key="header" primaryText="State" disabled={true}/>;
    const states = this.state.nodeStates.map(state=>
      <MenuItem key={state.val}
                primaryText={`${state.label}`}
                onTouchTap={()=>{this.handleNodeState(state.val)}}
                insetChildren={true}
                checked={this.props.nodeState === state.val}/>
    );
    return [header].concat(states);
  }
  focusMenuItem(){
    const focusLabel = "Toggle highlight node on graph";
    const focusNode = <MenuItem key="focusNode" primaryText={focusLabel} onTouchTap={this.handleNodeFocus}/>;
    const unfocusAll = <MenuItem key="unfocusAll" primaryText="Unhighlight all" onTouchTap={this.handleUnfocusAll}/>;
    return [focusNode, unfocusAll];
  }
  render(){
    const noPad = {"paddingBottom":"0px","paddingTop":"0px"};
    const itemClass = classNames({"blue-grey lighten-5": this.props.shared}, ["collection-item row"]);
    const nodeName = this.props.node.name;
    const stateLabel = this.props.nodeState;
    return (
      <div className={itemClass} style={noPad}>
        <div className="col s8">{nodeName}</div>
        <div className="col s4">
          <FlatButton onTouchTap={this.handleTouchTap}
                      label={stateLabel}
                      labelPosition="before"/>
          <Popover  open={this.state.open} anchorEl={this.state.anchorEl} onRequestClose={this.handleRequestClose}
                    anchorOrigin={{horizontal:"right",vertical:"top"}}
                    targetOrigin={{horizontal:"left",vertical:"top"}}>
              <Menu desktop={true}>
                {this.stateMenuItem()}
                <Divider />
                {this.focusMenuItem()}
              </Menu>
          </Popover>
        </div>
      </div>
    );
  }
}
