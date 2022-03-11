import React, {Component} from 'react';
import Table from './Table'
import Form from './Form'
import PianoRollComponent from './PianoRollComponent';
import SimpleComponent from './ClassComponent';
import TrackContainer from './TrackContainer';
import {Song, Track, Instrument, Effect} from 'reactronica';



class App extends React.Component {
    removeCharacter = (index) =>{
        const {characters} = this.state;
        
        console.log(index);
        this.setState({
            characters: characters.filter((character, i) => {
                return i !== index;
            }),
        })
    }    

    handleSubmit = (character) =>{
        this.setState({characters: [...this.state.characters, character]}) // need spread operator here bc characters may be empty
    }

    updateSteps = (steps) => {
        this.setState({
            currentSteps: steps,
        });
    }

    createNewPattern = () =>{
        let currentSteps = this.state.currentSteps;
        
        const patternIDString = "pattern-" + this.state.numPatterns; // might want to use randomly generated pattern names here 
        let foundIndex = 0;
        
        for(let i = 0; i<currentSteps.length; i++){
            if(currentSteps[i].trackID == this.state.currentSelectedTrackID) {
                foundIndex = i;
                break;
            }
        }

        console.log(patternIDString);
        // create a new 8 step pattern by default
        currentSteps[foundIndex].trackSteps.push({
            patternID: currentSteps[foundIndex].trackID + '-' + patternIDString, 
            pattern: [null, null, null, null, null, null, null, null]
        }) 
        this.setState({
            currentSteps: currentSteps, 
            numPatterns: this.state.numPatterns+1,
            newPatternID: patternIDString,
        });

        // generate new pattern inside trackView
        
    }
    
    // find and remove the selected pattern from currentSteps
    deletePattern = (patternID) =>{
        
    }

    handleCreateNewTrack = (trackID) =>{ // we want to create a new entry in currentSteps for each new track created
        let currentSteps = this.state.currentSteps;
        currentSteps.push({trackID: trackID, trackSteps: []});
        this.setState({currentSteps: currentSteps})
    }

    handleDeleteTrack = (trackID) =>{
        let currentSteps = this.state.currentSteps;
        for(let i = 0; i<currentSteps.length; i++){
            if(currentSteps[i].trackID == trackID){
                currentSteps.splice(i, 1);
                break;
            } 
        }
        this.setState({currentSteps: currentSteps});
    }

    handleTrackClick = (trackID) =>{
        this.setState({currentSelectedTrackID: trackID});
    }

    // use this to also to set the notes in the pattern depending on the piano roll
    handlePatternClick = (patternID) =>{
        console.log(patternID)
        this.setState({currentSelectedPatternID: patternID});
    }
    
    state = {
        characters: [
            /*{
                name: 'Charlie',
                job: 'Janitor',
            },
            {
                name: 'Mac',
                job: 'Bouncer',
            },
            {
                name: 'Dee',
                job: 'Aspiring Actress'
            },
            {
                name: 'Dennis',
                job: 'Bartender',
            },*/
        ],

        //v we can use this to insert patterns into the tracks {trackID, allSteps:array}
        currentSteps: [
            {trackID: 'track-1', trackSteps: []}, 
            {trackID: 'track-2', trackSteps: []},
            {trackID: 'track-3', trackSteps: []},
        ], 
        currentSelectedTrackID: 'track-1', // use to check which track to insert pattern TODO: need to change this depending on which track is selected... maybe add an onclick or something for the trackcontainer
        numPatterns: 0,
        newPatternID: '',
        currentSelectedPatternID: '',
    }
    render() {
        const {characters} = this.state; // why does this break without braces???
      return(
        <div className="container">
          <h1>Oxygen</h1>
          <Table characterData={characters} removeCharacter={this.removeCharacter}/>
          <button id='new-pattern-button' key='new-pattern-button' onClick={this.createNewPattern}>New Pattern</button>
          <button id='delete-pattern-button' key='delete-pattern-button' onClick={this.deletePattern}>Delete Pattern</button>
          <Song>
            <TrackContainer 
                handlePatternClick={this.handlePatternClick}
                newPatternID={this.state.newPatternID} // need to update this to track-#-pattern#
                currentSteps={this.state.currentSteps}
                updateSteps={(steps) => {this.updateSteps(steps)}}
                handleCreateNewTrack={this.handleCreateNewTrack}
                handleDeleteTrack={this.handleDeleteTrack}
                handleTrackClick={this.handleTrackClick}
                currentSelectedPatternID={this.state.currentSelectedPatternID}
            />
            <PianoRollComponent 
                updateSteps={(steps) => {this.updateSteps(steps)}}
            />
          </Song>
          <Form handleSubmit={this.handleSubmit}/>
        </div>
      )
    }
  }

  export default App