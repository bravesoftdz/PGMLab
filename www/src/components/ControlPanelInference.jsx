import React from 'react'

import {SelectPathways} from './SelectPathways.jsx'
import {SelectedPathways} from './SelectedPathways.jsx'

import {SelectObservationSet} from './SelectObservationSet.jsx'
import {ObservationSet} from './ObservationSet.jsx'

export class ControlPanelInference extends React.Component {

    componentDidMount() {
        $('.collapsibleInference').collapsible({accordion : true})
    }

    componentDidUpdate() {
        $('.tooltipped').tooltip({delay: 50})
        $('input#input_text, textarea#textarea1').characterCounter()
    }

    render() {
console.log("CPI", this.props)
        var activePathway = this.props.activePathway.name
        return (
            <div>
                <div className="section">
                    <h5>Data Selection</h5>
                    <ul className="collapsible collapsibleInference" data-collapsible="accordion">
                        <li>
                            <div className="collapsible-header"><i className="material-icons">visibility</i>Observation Sets</div>
                            <div className="collapsible-body">
                                <SelectObservationSet
                                         type                   = "inference"
                                         selectedObservationSet = {this.props.selectedObservationSet}
                                         selectObservationSet   = {this.props.selectObservationSet}
                                         observationSets        = {this.props.observationSets} />
                           </div>
                        </li>
                    </ul>
                    <ul className="collapsible collapsibleInference" data-collapsible="accordion">
                        <li>
                            <div className="collapsible-header"><i className="material-icons">group_work</i>Pathways</div>
                            <div className="collapsible-body">
                                <SelectPathways setActivePathway      = {this.props.setActivePathway}
                                                activePathway         = {this.props.activePathway}
                                                selectPathway         = {this.props.selectPathway}
                                                removeSelectedPathway = {this.props.removeSelectedPathway}
                                                selectedPathways      = {this.props.selectedPathways}
                                                pathways              = {this.props.pathways}
                                                runType               = "inference" />
                           </div>
                        </li>
                    </ul>
                </div>
                <div className="divider"></div>
                <div className="section">
                    <div className="row"> 
                        <h5 className="col s11">Selected Observation Set</h5>
                        <a className="btn-floating btn-small waves-effect waves-light light-blue lighten-1 col s1 tooltipped"
                                            data-position="top" data-delay="50" data-tooltip="Create Observation Set">+</a>
                    </div>
                    <ObservationSet selectedObservationSet = {this.props.selectedObservationSet} 
                                    runType                = "inference"
                                    setNodeState           = {this.props.setNodeState}
                                    observationSets        = {this.props.observationSets}
                                    selectObservation      = {this.props.selectObservation}
                                    selectedObservation    = {this.props.selectedObservation}
                                    observeNode            = {this.props.observeNode}
                                    pairwiseInteractions   = {this.props.pairwiseInteractions}
                                    removeObservedNode     = {this.props.removeObservedNode} />
                    <h5 className="tooltipped"
                        data-position="top" data-delay="50" data-tooltip="These Pathways will be included when generating posterior probabilities">Selected Pathway(s)</h5>
                    <SelectedPathways pathways         = {this.props.pathways}
                                      activePathway    = {this.props.activePathway}
                                      setActivePathway = {this.props.setActivePathway}
                                      type             = "inference"
                                      selectedPathways = {this.props.selectedPathways} />

                </div>
                <div className="section">
                    <i className="material-icons tiny right">settings</i>
                    <a className="waves-effect waves-light btn" onClick={this.run}>Run</a>
                </div>
                <div className="divider"></div>
                <div className="section">
                   <h5>Results:</h5>
                    <ul className="collapsible" data-collapsible="accordion">
                        <li>
                            <div className="collapsible-header"><i className="material-icons">assessment</i>Posterior Probability Sets</div>
                            <div className="collapsible-body">
                                <ul>
                                    <li>pp 1</li>
                                    <li>pp 2</li>
                                    <li>pp 3</li>
                                    <li>pp 4</li>
                                </ul>
                            </div>
                       </li>
                    </ul>
                </div>
            </div>)
    }
}
