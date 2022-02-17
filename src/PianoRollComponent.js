import { render } from '@testing-library/react';
import { typeImplementation } from '@testing-library/user-event/dist/type/typeImplementation';
import React, { Component, useState } from 'react';
import {Song, Track, Instrument} from 'reactronica';

var noteNames =     ['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
                            'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4']

class PianoRoll extends Component{
    constructor(props){
        super(props);
        let tmp = [];
        let steps = [];
        for(var i = 0; i<24; i++){ // we hardcode the totalsteps here lol, fix later
            for(var index = 0; index<16; index++){
                let buttonID = `pianobutton-${noteNames[i]}-${index}`;
                tmp.push(
                    {name: buttonID, isActive: false}
                );
            }
        }

        // populate steps with empty arrays for populating later
        for(var i = 0; i<16; i++){
            steps.push([]);
        }

        this.state = {
            totalSteps: 16,
            totalKeys: 24,
            pianoButtonStyle: "piano-roll-button-unclicked",
            pianoButtons: tmp, // todo: change this into a 1d array -- done?
            steps: steps,
        };
    }

    changePianoButtonStyle = (e) =>{
        const buttonID = e.target.id;
        console.log(buttonID);
        /*if(className == "piano-roll-button-unclicked"){
            this.setState({
                pianoButtonStyle: "piano-roll-button-clicked"
            });
        }else{
            this.setState({
                pianoButtonStyle: "piano-roll-button-unclicked"
            });
        }*/

       let tmp = this.state.pianoButtons;
       let tmpSteps = this.state.steps;
       let clickedButtonIsActive = false;
       /*let obj = tmp.filter((item)=>{
           return item.name === buttonID
        });*/
        for(var i = 0; i<tmp.length; i++){
            //console.log(tmp[0][i]);
            //console.log(tmp[0][i].name === buttonID)
            //console.log(tmp[0][i].name + " " + buttonID);
            if(tmp[i].name === buttonID){
                tmp[i].isActive = !tmp[i].isActive;
                clickedButtonIsActive = tmp[i].isActive;
                break;
            }
        }
       console.log(tmpSteps);

       // add to steps upon activating, or removing upon deactivating
       let columnNum = buttonID.split('-')[2];
       let noteName = buttonID.split('-')[1];
       if(clickedButtonIsActive){
           tmpSteps[columnNum].push(noteName);
       }else{
           // loop through the columnNum and find the noteName to remove
           for(var i = 0; i<tmpSteps[columnNum].length; i++){
               if(tmpSteps[columnNum][i] === noteName){
                    tmpSteps[columnNum].splice(i, 1); // remove inactive button
               }
           }
       }
       this.props.setSteps(tmpSteps);
       this.setState({pianoButtons: tmp});
    }

    checkButtonActive = (e) =>{
        const buttonID = e.target.id;
        const tmp = this.state.pianoButtons;
        for(var i = 0; i<tmp.length; i++){
            if(tmp[i].name === buttonID){
                console.log("isactive? " + tmp[0][i].isActive)
                this.setState({pianoButtons: tmp});
                return tmp[i].isActive;
            }
        }

        return false;
    }

    render(){
        const {currentStepIndex, onClick} = this.props;
        //const [totalSteps, setTotalSteps] = useState(16); // total steps to render in table

        //setTotalSteps(16);
        //console.log(currentStepIndex);
        let rows = [];
        let cell = [];
        // populating header row 
        for(var index=0; index<this.state.totalSteps; index++){
            let cellID = `headercell-${index}`;
            cell.push(
            <td 
                key={cellID} 
                id={cellID} 
                className={index==currentStepIndex ? "pianorollheader-active" : "pianorollheader"}
            >{index+1}</td>);
        }
        rows.push(<tr key="table-row-header" id="table-row-header"><td></td>{cell}</tr>);
        
        // set colour of header based on currentstep
        //rows[0][currentStepIndex]
        
        let counter = 0;
        for(var i = 0; i<this.state.totalKeys; i++){
            let rowID = `row${i}`
            let cell = []
            for(var index = 0; index<this.state.totalSteps; index++){ // horizontal cells
                let cellID = `cell${i}-${index}`;
                let buttonID = `pianobutton-${noteNames[i]}-${index}`;
                cell.push(
                        <td key={cellID} id={cellID}>
                            
                                <button 
                                    key={buttonID} 
                                    id={buttonID} 
                                    //className={this.checkButtonActive ? "piano-roll-button-unclicked" : "piano-roll-button-clicked"}
                                    className={this.state.pianoButtons[counter].isActive ? "piano-roll-button-clicked" : "piano-roll-button-unclicked"}
                                    onClick={this.changePianoButtonStyle}>
                                </button>
                            
                        </td>
                    );
                counter++;
            }
            let pianoKeyID = `pianokey-${noteNames[i]}`; // we use this later to determine colouring
            rows.push(<tr key={i} id={rowID}><td><button id={pianoKeyID}>{noteNames[i]}</button></td>{cell}</tr>);
        }
        return(
            <div className="piano-roll-container">
                <div className='row'>
                    <div className='col s12 board'>
                        <table id='board'>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    
}

const PianoRollComponent = (props) =>{
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [steps, setSteps] = useState([
        ['C3', 'E3', 'A3'],
        null,
        ['C3', 'E3', 'G3', 'B3'],
        null,
        ['C3', 'F3', 'A3'],
        null,
        ['D3', 'G3', 'B3'],
        null,
    ]);

    return(
        <>
        <button onClick={()=>setIsPlaying(!isPlaying)}>{isPlaying? 'Stop' : 'Play'}</button>
        <PianoRoll
            currentStepIndex={currentStepIndex}
            setSteps={(steps) => setSteps(steps)}
        />

        <Song isPlaying={isPlaying}>
            <Track 
                steps={steps} 
                onStepPlay={(stepNotes, index)=>{
                    setCurrentStepIndex(index);
                }}
            >
            <Instrument type="polySynth" />
            </Track>
        </Song>
        </>
    );
}

export default PianoRollComponent