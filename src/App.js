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
        currentSteps: [], //v we can use this to insert patterns into the tracks
        currentSelectedTrackID: 0, // use to check which track to insert pattern 
    }
    render() {
        const {characters} = this.state; // why does this break without braces???
      return(
        <div className="container">
          <h1>Hello, React!</h1>
          <Table characterData={characters} removeCharacter={this.removeCharacter}/>
          <SimpleComponent/>
          <button>New Pattern</button>
          <Song>
            <TrackContainer 
                updateSteps={(steps) => {this.updateSteps(steps)}}
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