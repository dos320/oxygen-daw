import React, {Component} from 'react';
import Table from './Table'
import Form from './Form'
import PianoRollComponent from './PianoRollComponent';
import SimpleComponent from './ClassComponent';
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
    }
    render() {
        const {characters} = this.state; // why does this break without braces???
      return(
        <div className="container">
          <h1>Hello, React!</h1>
          <Table characterData={characters} removeCharacter={this.removeCharacter}/>
          <SimpleComponent/>
          <PianoRollComponent/>
          <Form handleSubmit={this.handleSubmit}/>
        </div>
      )
    }
  }

  export default App