import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';
import { render } from '@testing-library/react';
import { typeImplementation } from '@testing-library/user-event/dist/type/typeImplementation';
import React, { Component, useState } from 'react';
import {Song, Track, Instrument, Effect} from 'reactronica';
import { Filter } from 'tone';
import TrackPattern from './TrackPattern';

var _ = require('lodash');
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
                className={(this.props.muteActive || (this.props.currentSoloTrack !== this.props.trackID && this.props.currentSoloTrack !== '')) ? 'trackButton-active':'trackButton-inactive'} 
                onClick={this.props.handleMuteButtonClick}>
                    Mute
                </button>
                <button 
                key='track-solo-button-1' 
                id='track-solo-button-1'
                className={(this.props.soloActive) ? 'trackButton-active': (this.props.currentSoloTrack !== this.props.trackID && this.props.currentSoloTrack !== '') ? 'solo-button-disabled' : 'trackButton-inactive'}
                onClick={this.props.handleSoloButtonClick}
                disabled={(this.props.currentSoloTrack !== this.props.trackID && this.props.currentSoloTrack !== '') ? true : false}
                >
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
            // TODO: find some way to render these patterns side by side -- done.
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
        stepsToPlay: [],
    }
    state = this.initialState;

    handleMuteButtonClick = () =>{
        // notify parent that mute button is clicked
        // change style of clicked button (done, as the className is set to the appropriate class)
        
        if(this.props.currentSoloTrack == ''){ // disables muting when solo is active 
            let muteActive = !this.state.muteActive;

            this.setState({muteActive}); // change style
            //this.

            this.handleMute();
            
            this.props.handleMuted(this.props.trackID); 
        }
    }
    
    handleSoloButtonClick = () =>{
        let soloActive = !this.state.soloActive;
        this.setState({soloActive});
        if(soloActive) this.props.handleSoloTrackChange(this.props.trackID);
        else this.props.handleSoloTrackChange('');

        this.handleMute(); // need to call this after both mute and solo button clicks
        this.props.handleSolo(this.props.trackID); // mutes every track but this track, indicated by the trackID
    }

    handleMute = () =>{
        let isTrackMuted = false;
        if(this.state.muteActive) isTrackMuted = true;
        if(this.props.currentSoloTrack !== this.props.trackID){
            isTrackMuted =  true;
            console.log(this.props.currentSoloTrack);
            console.log(this.props.trackID);
        } 

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

    /*componentDidUpdate(prevProps){
        console.log(prevProps.currentTrackStepsSteps)
        console.log(this.props.currentTrackStepsSteps)
        if(prevProps.currentTrackStepsSteps !== this.props.currentTrackStepsSteps){
            //console.log("here1")
            // generate the steps to play here
            let tempSteps = this.props.currentTrackStepsSteps;
            let stepsToPlay = [];
            for(let i = 0; i<tempSteps.length; i++){
                stepsToPlay.push(tempSteps.pattern);
            }
            //console.log(tempSteps)
            this.setState({stepsToPlay: stepsToPlay});

        }
    }*/

    render(){ // create new TrackPatterns inside the track
        // generate the steps to play here
        //let tempSteps = this.props.currentTrackSteps.trackSteps;
        //let stepsToPlay = [];
        //for(let i = 0; i<tempSteps.length; i++){
        //    stepsToPlay.push(tempSteps.pattern);
        //}
        //this.setState();

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
                handleMuted={this.props.handleMuted}
                isTrackMuted={this.state.isTrackMuted}
                currentSoloTrack={this.props.currentSoloTrack}
                trackID={this.props.trackID}
                >
                </TrackControl>    
                
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
        mutedTracks: [
            {trackID: 'track-1', muted: false},
            {trackID: 'track-2', muted: false},
            {trackID: 'track-3', muted: false},
        ],
        currentSoloTrack: '',
        currentTrackIds: [
            'track-1',
            'track-2',
            'track-3',
        ],
        currentSelectedTrackID: '',
        generatedTrackID: 3, // scuffed solution, ensures that every generated track key is unique
    };
    state = this.initialState;

    // keep track of muted status for each track in an array
    handleMuted = (trackID) =>{
        let tempMutedTracks = this.state.mutedTracks; // currently working with refs... come back later
        let foundIndex = tempMutedTracks.findIndex((element)=>{
            return element.trackID === trackID;
        });
        tempMutedTracks[foundIndex].muted = !tempMutedTracks[foundIndex].muted;
        this.setState({mutedTracks: tempMutedTracks});
    }

    // mute every track but the given track, indicated by the provided trackID
    handleSolo = (trackID) =>{
        let tempMutedTracks = this.state.mutedTracks;
        for(let i = 0; i<tempMutedTracks.length; i++){
            if(tempMutedTracks[i].trackID !== trackID){
                tempMutedTracks[i].muted = !tempMutedTracks[i].muted;
            } 
        }
        console.log(tempMutedTracks);
        this.setState({mutedTracks: tempMutedTracks});
    }

    handleSoloTrackChange = (trackID) =>{
        this.setState({currentSoloTrack: trackID});
    }

    handleNewTrack = () =>{
        console.log("here")
        let tempTrackIds = this.state.currentTrackIds;
        let tempMutedTracks = this.state.mutedTracks; // also add an entry to mutedTracks
        let tempGeneratedTrackID = this.state.generatedTrackID;
        tempTrackIds.push('track-' + (tempGeneratedTrackID + 1)); // save in state after
        console.log(tempTrackIds);
        this.props.handleCreateNewTrack(tempTrackIds[tempTrackIds.length-1]); // creates new track entry in parent state for keeping track of patterns
        
        tempMutedTracks.push({trackID: 'track-' + (tempGeneratedTrackID + 1), muted: false});

        this.setState({currentTrackIds: tempTrackIds, mutedTracks: tempMutedTracks, generatedTrackID: tempGeneratedTrackID+1});
    }

    handleDeleteTrack = (trackID) =>{
        let tempTrackIds = this.state.currentTrackIds;
        let tempMutedTracks = this.state.mutedTracks;
        for(var i = 0; i<this.state.currentTrackIds.length; i++){
            console.log(this.state.currentTrackIds[i] == trackID);
            if(this.state.currentTrackIds[i] == trackID){
                tempTrackIds.splice(i, 1);
                break;
            } 
        }
        // remove track from mutedTracks
        for(let i = 0; i<this.state.mutedTracks.length; i++){
            if(this.state.mutedTracks[i].trackID === trackID){
                tempMutedTracks.splice(i, 1);
                break;
            }
        }
        this.props.handleDeleteTrack(trackID);
        this.setState({currentTrackIds: tempTrackIds, mutedTracks: tempMutedTracks});
    }

    // maybe move this to only the TrackControl? TODO: check if it works
    handleTrackClick = (trackID) =>{
        // change class of trackcontrol
        // set currentSelectedTrackID to this track
        console.log(trackID + " clicked");
        this.props.handleTrackClick(trackID);
        this.setState({currentSelectedTrackID: trackID});
    }

    handleTrackStepsStepsGeneration = (steps) => {
        // generate the steps to play here
        
        let stepsToPlay = [];
        for(let i = 0; i<steps.length; i++){
            console.log(steps[i].pattern);
            for(let j = 0; j<steps[i].pattern.length; j++){
                stepsToPlay.push(steps[i].pattern[j]);
            }
        }
        return stepsToPlay;
    }

    findTrackMuteStatus = (trackID) =>{
        let foundIndex = this.state.mutedTracks.findIndex((element)=>{
            return element.trackID === trackID;
        });

        return this.state.mutedTracks[foundIndex].muted;
    }

    componentDidUpdate(prevProps){
        //console.log(prevProps.trackOptions);
        //console.log(this.props.trackOptions);
        //if(this.props.prevTrackOptions !== []){
            //console.log(prevProps.trackOptions)
            //console.log(this.props.trackOptions)
            if(!_.isEqual(prevProps.trackOptions, this.props.trackOptions)){ // BUGGED - ENVELOPE DOES NOT UPDATE UNTIL INSTURMENT IS SWITCHED
                console.log("force update");
                this.forceUpdate(); 
            }
        //} 
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
        
        
        // populate effectslist -- need to do this for each track
        

        // renders depending on how many trackIDs there are. removing a track means removing a track id
        for(var i = 0; i<this.state.currentTrackIds.length; i++){
            //let currentTrackSteps = this.props.currentSteps.find(element =>{
                //return element.trackID === 'track-' + i;
            //});
            let effectsToRender = [];
            let foundObject = this.props.trackOptions.find((element)=>{return element.trackID === this.state.currentTrackIds[i]})
            //console.log(foundObject)
            if(foundObject.currentEffects.length > 0){
                for(let i = 0; i<foundObject.currentEffects.length; i++){
                    effectsToRender.push(
                        //<Effect type={this.props.currentEffects[i].value} wet={this.props.currentEffects[i].wet}/>
                        <Effect 
                            key={foundObject.currentEffects[i].value}
                            type={foundObject.currentEffects[i].value} 
                            wet={foundObject.currentEffects[i].wet}
                        />
                    );
                }
            }
            console.log(foundObject.currentSelectedOscillator);
            
            /* prevents repeating after the notes of a track have finished, done with onStepPlay */
            let foundTrackCurrentSteps = this.props.currentSteps.find((element)=>{
                return element.trackID === this.state.currentTrackIds[i];
            });
            let combinedSteps = this.handleTrackStepsStepsGeneration(foundTrackCurrentSteps.trackSteps);
            let tempMutedTracks = this.state.mutedTracks;
            let foundIndex = tempMutedTracks.findIndex((element)=>{
                return element.trackID === this.state.currentTrackIds[i];
            });
            tracksToRender.push(<Track
                                    volume={foundObject.volume} // -3 is default
                                    pan={foundObject.pan}
                                    mute={this.findTrackMuteStatus(this.state.currentTrackIds[i]) ? true : false} // need to create new funciton for this
                                    steps={[].concat(this.handleTrackStepsStepsGeneration(this.props.currentSteps[i].trackSteps))} // need to fix this
                                    key={this.state.currentTrackIds[i]}
                                    onStepPlay={(_, index)=>{
                                        if(index > combinedSteps.length){
                                            tempMutedTracks[foundIndex].muted = true;
                                        }else if(tempMutedTracks[foundIndex].muted){
                                            tempMutedTracks[foundIndex].muted = false;
                                        }
                                        // mute the track
                                        // unmute after pausing/playing
                                    }}
                                >
                                    <Instrument 
                                        type={foundObject.currentSelectedInstrument}
                                        samples={{
                                            C3: process.env.PUBLIC_URL + '/Kick Basic.mp3',
                                            D3: process.env.PUBLIC_URL + '/Snare Basic.mp3',
                                            E3: process.env.PUBLIC_URL + '/Clap Basic.mp3',
                                            F3: process.env.PUBLIC_URL + '/Hat Basic.mp3',
                                        }}
                                        onLoad={(buffers) => {
                                            // Runs when all samples are loaded
                                          }} 
                                        envelope={{
                                            attack: foundObject.currentADSR[0],
                                            decay: foundObject.currentADSR[1],
                                            sustain: foundObject.currentADSR[2],
                                            release: foundObject.currentADSR[3],
                                        }}
                                        polyphony={Number(foundObject.currentPolyphony)}
                                        oscillator={foundObject.currentSelectedInstrument === 'membraneSynth' || foundObject.currentSelectedInstrument === 'monoSynth' || foundObject.currentSelectedInstrument === 'synth' ? {type: foundObject.currentSelectedOscillator} : null}
                                    />
                                    <TrackView
                                        onClick={this.handleTrackClick}
                                        handlePatternClick={this.props.handlePatternClick}
                                        currentSelectedTrackID={this.state.currentSelectedTrackID}
                                        currentSoloTrack={this.state.currentSoloTrack}
                                        handleSoloTrackChange={this.handleSoloTrackChange}
                                        handleDeleteTrack={this.handleDeleteTrack}
                                        trackID={this.state.currentTrackIds[i]}
                                        currentTrackSteps={this.props.currentSteps[i]}
                                        newPatternID={this.props.newPatternID}
                                        currentSelectedPatternID={this.props.currentSelectedPatternID}
                                        currentPianoSteps={this.props.currentPianoSteps}
                                        handleMuted={this.handleMuted}
                                        handleSolo={this.handleSolo}
                                    />
                                    {effectsToRender}
                                </Track>
                                )
        }   
        return(
            
                <div className='multitrackContainer'>
                    <div style={this.props.isSongPlaying ? this.props.playheadCssProperties : this.props.playheadCssPropertiesInactive} ></div>
                    <Song isPlaying={this.props.isSongPlaying} bpm={this.props.currentBPM} volume={this.props.currentSongVolume}>
                        {tracksToRender}
                    </Song>
                    <button onClick={this.handleNewTrack}>New Track</button>
                </div>
            
        );
    }
    
}
export default TrackContainer;