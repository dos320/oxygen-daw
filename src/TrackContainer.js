import { render } from '@testing-library/react';
import { typeImplementation } from '@testing-library/user-event/dist/type/typeImplementation';
import React, { Component, useState } from 'react';
import {Song, Track, Instrument} from 'reactronica';
import { Filter } from 'tone';
import TrackPattern from './TrackPattern';

var noteNames =     ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
                            'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4']

// control bar on the left hand side of the track
class TrackControl extends Component{ // note: generally, we should always use class components when dealing with state
    constructor(props){
        super(props);
    }


    
    render(){ // style={}
        return(
            <>
            <div className={this.props.className}>
                <button 
                key='track-name-button-1' 
                id='track-name-button-1' 
                >
                    Track name
                </button>
                <button 
                key='track-mute-button-1' 
                id='track-mute-button-1' 
                className={this.props.muteActive ? 'trackButton-active':'trackButton-inactive'} 
                onClick={this.props.handleMuteButtonClick}>
                    Mute
                </button>
                <button 
                key='track-solo-button-1' 
                id='track-solo-button-1'
                className={this.props.soloActive ? 'trackButton-active':'trackButton-inactive'}
                onClick={this.props.handleSoloButtonClick}>
                    Solo
                </button>
                <button 
                key='track-delete-button-1' 
                id='track-delete-button-1'
                onClick={this.props.handleDeleteButtonClick}>
                    Delete
                </button>
            </div>
            </>
        );
    }
}

// the space inside the track that contains the patterns (separate file)
class TrackPatternContainer extends Component{ 
    constructor(props){
        super(props);

        
    }

    initialState = {
        // same as totalSteps in the piano component
        totalSteps: 16,
        totalKeys: 24,
        patternsToRender:[],
        //clickedPatternID: '',
        //patternIDsActive:[],
        activeSteps:[],
    };
    state = this.initialState;
    
    
    // on click
    // send notes to piano roll (upwards)
    // establish connection with piano roll
    handlePatternClickHelper = (e) =>{
        console.log("test" + e.target.id);
        this.props.handlePatternClick(e.target.id); // how does this work
        
        //let tmp = this.state.patternIDsActive;
        //for(let i = 0; i<tmp.length; i++){
            //if(tmp[i].patternID === e.target.id) tmp[i].active = true;
            //else tmp[i].active = false;
        //}
        //this.setState({patternIDsActive: tmp});
        // set class of clicked pattern
    }

    // generate patterns here
    render(){
        let patternsToRender = [];
        let activeSteps = [];
        // serves to populate activeSteps 
        for(let i = 0; i<this.props.currentTrackSteps.trackSteps.length; i++){
            activeSteps.push([...Array(24)].map(e => Array(16).fill(false))); // push empty 16x24 array for each new pattern
            console.log(this.props.currentTrackSteps.trackSteps[i].pattern)
            for(let j = 0; j<this.props.currentTrackSteps.trackSteps[i].pattern.length; j++){
                if(this.props.currentTrackSteps.trackSteps[i].pattern[j].length > 0 && this.props.currentTrackSteps.trackSteps[i].pattern[j].length !== null){
                    for(let k = 0; k<this.props.currentTrackSteps.trackSteps[i].pattern[j].length; k++){
                        console.log("pattern below")
                        console.log(this.props.currentTrackSteps.trackSteps[i].pattern[j][k])
                        let foundIndex = noteNames.indexOf(this.props.currentTrackSteps.trackSteps[i].pattern[j][k]);
                        if(foundIndex != -1) activeSteps[i][j][foundIndex] = true;
                    }
                }
            }
            console.log(activeSteps);
        }
        
        
        // ### pattern
        for(let i = 0; i<this.props.currentTrackSteps.trackSteps.length; i++){
            // generate table(patterns)
            // TODO: add the proper steps to each pattern
            let rows=[];
            let patternIDString = this.props.newPatternID;
            activeSteps.push([]);
            // ### pattern rows
            for(let j = this.state.totalKeys; j>=0; j--){ // this must be in reverse for the lines to be rendered UPWARDS
                // we can simply add an ordering property later IF moving around patterns is permitted
                //let rowID = `${patternIDString}-row${i}`;
                let rowID = 'pattern' + i + '-row' + j;
                let cell = [];
                // ### pattern cells
                for(let idx = 0; idx < this.state.totalSteps; idx++){
                    //let cellID = `${patternIDString}-cell${i}-${idx}`;
                    let cellID = 'pattern' + i + '-cell' + idx;
                    let filled = false;
                    // check if empty or not - indicate with filled variable
                    //if(this.props.currentTrackSteps.trackSteps[i].pattern[idx][j] != ''){
                        //let foundIndex = noteNames.findIndex((element)=>{
                            //return element === this.props.currentTrackSteps.trackSteps[i].pattern[idx][j];
                        //});
                        // TODO: might need to move this outside, in a separate loop to check after all the cells have already been generated
                        
                    //}
                    if(activeSteps[i][idx][j]) filled = true;
                   
                    cell.push(<td key={cellID} id={cellID} className={filled ? 'pattern-td-filled' : 'pattern-td'}></td>);
                }
                rows.push(<tr key={rowID} id={rowID} className='pattern-tr'>{cell}</tr>);
            }
            // TODO: find some way to render these patterns side by side
            patternsToRender.push(
                <div 
                    className={this.props.currentSelectedPatternID == (this.props.trackID + '-pattern-' + i) ? 'trackPattern-active' : 'trackPattern'} 
                    //id={`${patternIDString}`} 
                    //key={`${patternIDString}`} 
                    id={this.props.trackID + '-pattern-' + i}
                    key={this.props.trackID + '-pattern-' + i}
                    onClick={this.handlePatternClickHelper}
                >
                    <table id={'pattern' + i + '-table'}>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            );
            //patternIDsActive.push({
            //    patternID: this.props.trackID + '-pattern' + i, 
            //    active: false,
            //});
            //this.setState({patternIDsActive: patternIDsActive});  
        }

        return(
            <div className='trackPatternContainer'>
                test
                {patternsToRender}
            </div>
        );
    }
}

// a singular track
class TrackView extends Component{ 
    constructor(props){
        super(props);
        this.handleMuteButtonClick = this.handleMuteButtonClick.bind(this);
        this.handleSoloButtonClick = this.handleSoloButtonClick.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    initialState = {
        muteActive: false,
        soloActive: false,
        trackName: '',
        isTrackMuted: false,
        isClicked: false,
    }
    state = this.initialState;

    handleMuteButtonClick = () =>{
        // notify parent that mute button is clicked
        // change style of clicked button (done, as the className is set to the appropriate class)
        let muteActive = !this.state.muteActive;

        this.setState({muteActive});
        //this.

        this.handleMute();
    }
    
    handleSoloButtonClick = () =>{
        let soloActive = !this.state.soloActive;
        this.setState({soloActive});
        if(soloActive) this.props.handleSoloTrackChange(this.props.trackID);
        else this.props.handleSoloTrackChange('');

        this.handleMute(); // need to call this after both mute and solo button clicks
        
    }

    handleMute = () =>{
        let isTrackMuted = false;
        if(this.state.muteActive) isTrackMuted = true;
        if(this.props.currentSoloTrack != this.props.trackID) isTrackMuted =  true;

        this.setState({isTrackMuted: isTrackMuted});
    }

    handleDeleteButtonClick = () => {
        this.props.handleDeleteTrack(this.props.trackID); // deletes the corresponding entry in parent
    }

    handleTrackClick = () =>{ // passes the trackID up to the app level
        this.props.onClick(this.props.trackID);
        // change class of trackControl
        //let clicked = false;
        //if(this.props.currentSelectedTrackID == this.props.trackID) clicked = true;
        //this.setState({isClicked: clicked}); // TODO: fix this... need to keep track of this at the high level. currently doesnt reset
    }

    render(){ // create new TrackPatterns inside the track
        return(
            <div className='trackContainer' onClick={this.handleTrackClick}>   
                <TrackControl
                className={this.props.currentSelectedTrackID == this.props.trackID ? 'trackControlContainer-active' : 'trackControlContainer'}
                handleMuteButtonClick={this.handleMuteButtonClick}
                handleSoloButtonClick={this.handleSoloButtonClick}
                handleDeleteButtonClick={this.handleDeleteButtonClick}
                trackName={this.state.trackName}
                muteActive={this.state.muteActive}
                soloActive={this.state.soloActive}
                >
                </TrackControl>    
                <Track
                volume={-3}
                pan={0}
                mute={this.state.isTrackMuted ? true : false}
                >
                </Track>
                <TrackPatternContainer 
                    trackID={this.props.trackID}
                    currentTrackSteps={this.props.currentTrackSteps} 
                    newPatternID={this.props.newPatternID}
                    handlePatternClick={this.props.handlePatternClick}
                    currentSelectedPatternID={this.props.currentSelectedPatternID} //TODO: figure out rendering the steps inside each pattern
                />
            </div>
        );
    }
}

// contains all tracks
class TrackContainer extends Component{ 
    constructor(props){
        super(props);
        this.handleSoloTrackChange = this.handleSoloTrackChange.bind(this);
    }
    
    initialState={ // note: must add new entries to these upon creating a new track?
        mutedTracks: [],
        currentSoloTrack: '',
        currentTrackIds: [
            'track-1',
            'track-2',
            'track-3',
        ],
        currentSelectedTrackID: '',
    };
    state = this.initialState;

    handleMuted = (trackID) =>{
        let tempMutedTracks = this.state.mutedTracks; // currently working with refs... come back later
        
        
    }

    handleSoloTrackChange = (trackID) =>{
        this.setState({currentSoloTrack: trackID});
    }

    handleNewTrack = () =>{
        console.log("here")
        let tempTrackIds = this.state.currentTrackIds;
        tempTrackIds.push('track-' + (this.state.currentTrackIds.length + 1));
        console.log(tempTrackIds);
        this.props.handleCreateNewTrack(tempTrackIds[tempTrackIds.length-1]); // creates new track entry in parent state for keeping track of patterns
        
        this.setState({currentTrackIds: tempTrackIds});
    }

    handleDeleteTrack = (trackID) =>{
        let tempTrackIds = this.state.currentTrackIds;
        for(var i = 0; i<this.state.currentTrackIds.length; i++){
            console.log(this.state.currentTrackIds[i] == trackID);
            if(this.state.currentTrackIds[i] == trackID){
                tempTrackIds.splice(i, 1);
                break;
            } 
        }
        this.props.handleDeleteTrack(trackID);
        this.setState({currentTrackIds: tempTrackIds});
    }

    // maybe move this to only the TrackControl? TODO: check if it works
    handleTrackClick = (trackID) =>{
        // change class of trackcontrol
        // set currentSelectedTrackID to this track
        console.log(trackID + " clicked");
        this.props.handleTrackClick(trackID);
        this.setState({currentSelectedTrackID: trackID});
    }

    //getTrackID = (trackID) =>{
    //    this.setState({currentSelectedTrackID: trackID});
    //}

    // upon clicking the solo button, we want to send to the trackcontainer the trackID (add this trackid in trackview)
    // after receiving the trackID, we want to use a function in trackcontainer to look through each trackview
    // and call the mute function in each (except for the one that is solo)
    // ^^ perhaps use refs here
    // pass down the currentsolotrack thing, each child checks to see if its id matches-  if not, then set to mute
    // if blank, unmute

    /*
                <TrackView 
                currentSoloTrack={this.state.currentSoloTrack} // send to all child tracks, check if they have the same id, if not, then  mute
                handleSoloTrackChange={this.handleSoloTrackChange}
                trackID='track-1' // this is sus, i dont think we need this? -- we moved it here instead
                />
    */

    render(){
        var tracksToRender = [];
        for(var i = 0; i<this.state.currentTrackIds.length; i++){
            //let currentTrackSteps = this.props.currentSteps.find(element =>{
                //return element.trackID === 'track-' + i;
            //});
            tracksToRender.push(<TrackView
                                    onClick={this.handleTrackClick}
                                    handlePatternClick={this.props.handlePatternClick}
                                    currentSelectedTrackID={this.state.currentSelectedTrackID}
                                    currentSoloTrack={this.state.currentSoloTrack}
                                    handleSoloTrackChange={this.handleSoloTrackChange}
                                    handleDeleteTrack={this.handleDeleteTrack}
                                    trackID={this.state.currentTrackIds[i]}
                                    key={this.state.currentTrackIds[i]}
                                    currentTrackSteps={this.props.currentSteps[i]}
                                    newPatternID={this.props.newPatternID}
                                    currentSelectedPatternID={this.props.currentSelectedPatternID}
                                    currentPianoSteps={this.props.currentPianoSteps}
                                    />
                                )
        }   
        return(
            <div className='multitrackContainer'>
                {tracksToRender}
                <button onClick={this.handleNewTrack}>New Track</button>
            </div>
            
        );
    }
    
}
export default TrackContainer;