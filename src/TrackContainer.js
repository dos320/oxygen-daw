import { render } from '@testing-library/react';
import { typeImplementation } from '@testing-library/user-event/dist/type/typeImplementation';
import React, { Component, useState } from 'react';
import {Song, Track, Instrument} from 'reactronica';
import TrackPattern from './TrackPattern';

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
    render(){
        return(
            <div className='trackPatternContainer'>
                test
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
                <TrackPatternContainer/>
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
            tracksToRender.push(<TrackView
                                    onClick={this.handleTrackClick}
                                    currentSelectedTrackID={this.state.currentSelectedTrackID}
                                    currentSoloTrack={this.state.currentSoloTrack}
                                    handleSoloTrackChange={this.handleSoloTrackChange}
                                    handleDeleteTrack={this.handleDeleteTrack}
                                    trackID={this.state.currentTrackIds[i]}
                                    key={this.state.currentTrackIds[i]}
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