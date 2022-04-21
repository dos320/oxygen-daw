import React, {Component} from 'react';
import Table from './Table'
import Form from './Form'
import PianoRollComponent from './PianoRollComponent';
import SimpleComponent from './ClassComponent';
import TrackContainer from './TrackContainer';
import {Song, Track, Instrument, Effect} from 'reactronica';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';
import OptionsComponent from './OptionsComponent';
import { Slider, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

var _ = require('lodash');

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
        
        
        const patternIDString = "pattern-" + this.state.numPatterns[this.state.numPatterns.findIndex((element)=> {
            //console.log(trackID)
            //console.log(this.state.currentSelectedTrackID)
            return element.trackID === this.state.currentSelectedTrackID;
        })].num; // might want to use randomly generated pattern names here 
        let foundIndex = 0;
        
        for(let i = 0; i<currentSteps.length; i++){
            if(currentSteps[i].trackID == this.state.currentSelectedTrackID) {
                foundIndex = i;
                break;
            }
        }
        
        // adding one to numPatterns
        let tempNumPatterns = this.state.numPatterns;
        let foundNumPatternsIndex = tempNumPatterns.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        
        tempNumPatterns[foundNumPatternsIndex].num++;

        console.log(patternIDString);
        // create a new 8 step pattern by default
        currentSteps[foundIndex].trackSteps.push({
            patternID: currentSteps[foundIndex].trackID + '-' + patternIDString, 
            pattern: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
        }) 
        this.setState({
            currentSteps: currentSteps, 
            //numPatterns: this.state.numPatterns+1,
            numPatterns: tempNumPatterns,
            newPatternID: patternIDString,
        });

        // generate new pattern inside trackView
        
    }
    
    // find and remove the selected pattern from currentSteps
    deletePattern = (patternID) =>{
        let currentSteps = this.state.currentSteps;
        let foundIndex = currentSteps.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        console.log(foundIndex)
        currentSteps[foundIndex].trackSteps.splice(currentSteps[foundIndex].trackSteps.findIndex((element)=>{
            return element.patternID === patternID;
        }), 1);
        this.setState({currentSteps: currentSteps});
    }

    handleCreateNewTrack = (trackID) =>{ // we want to create a new entry in currentSteps for each new track created
        let currentSteps = this.state.currentSteps;
        let currentNumPatterns = this.state.numPatterns;
        let currentTrackOptions = this.state.trackOptions;
        let currentTrackNames = this.state.trackNames;
        currentSteps.push({trackID: trackID, trackSteps: []});

        // create new entry in numPatterns
        currentNumPatterns.push({trackID: trackID, num: 0});

        // create new entry in trackOptions
        currentTrackOptions.push(
            {
                trackID: trackID,
                currentSelectedInstrument: 'amSynth',
                currentSelectedOscillator: 'triangle',
                currentPolyphony: 1,
                currentADSR:[0.2,0.2,0.2,0.2],
                currentEffects:[],
                volume: -3,
                pan: 0,
            },
        );

        // create new entry in trackNames
        currentTrackNames.push({trackID: trackID, name: 'New Track'});

        this.setState({currentSteps: currentSteps, numPatterns: currentNumPatterns});
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
    // pattern -> reflected on piano
    handlePatternClick = (patternID) =>{
        console.log(patternID)
        this.setState({currentSelectedPatternID: patternID},
            ()=>{
                // send the corresponding pattern in currentSteps.trackSteps down to the piano roll
        
                // find the current selected pattern inside the current selected track
                let foundPattern = this.state.currentSteps.find(element => {
                    return element.trackID === this.state.currentSelectedTrackID;
                }).trackSteps.find(element => {
                    return element.patternID === this.state.currentSelectedPatternID;
                });
                console.log(foundPattern);
                
                if(foundPattern !== undefined) this.setState({currentPianoRollSteps: foundPattern.pattern});
                // after this, changes in the piano roll are reflected on the pattern, instead of vice versa
            });
            
    }

    // changes on piano roll -> reflected on pattern
    updateCurrentPianoRollSteps = (steps) =>{
        this.setState({currentPianoRollSteps: steps},
            ()=>{
                // update currently selected pattern with new steps
                let tempCurrentSteps = this.state.currentSteps;
                if(tempCurrentSteps !== undefined && this.state.currentSelectedPatternID !== undefined
                    && this.state.currentSelectedPatternID !== '' && this.state.currentSelectedTrackID !== undefined){
                    tempCurrentSteps.find(element => {
                        return element.trackID === this.state.currentSelectedTrackID;
                    }).trackSteps.find(element => {
                        return element.patternID === this.state.currentSelectedPatternID;
                    }).pattern = steps;
                    this.setState({currentSteps: tempCurrentSteps});
                }
            });
    }

    handleAppLevelPlayButtonClick = () =>{
        this.setState({
            isPlaying: !this.state.isPlaying
        }, ()=>{
            if(this.state.isPlaying){
                let tempIntervals = [];
                let maxNumPatterns = _.maxBy(this.state.numPatterns, (element)=>{
                    return element.num;
                })
                console.log("maxnumpatterns: " + maxNumPatterns)
                let animTime = 1800 / (18.75 * this.state.currentBPM / 60);
                let intervalTime = ((300 * maxNumPatterns.num / 1800) * animTime) *1000;
                console.log("interval time: " + intervalTime);
                tempIntervals.push(setInterval(()=>{
                    console.log("timeout");
                    this.setState({restartAnimation: true}, ()=>{
                        requestAnimationFrame(()=>{
                            console.log(this.state.restartAnimation)
                            this.setState({restartAnimation:false});
                        })
                    })
                }, intervalTime)) // set this time: 300*max_num_patterns / 1800 * animTime
                this.setState({intervals: tempIntervals});
            }else{
                let tempIntervals = this.state.intervals;
                for(let i = 0; i<tempIntervals.length; i++){
                    clearInterval(tempIntervals[i]);
                }
                this.setState({intervals: []});
            }
            
        });
    }

    /* optioncomponent stuff */
    setCurrentSelectedInstrument = (instrument) =>{
        let tempTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackOptions[foundIndex].currentSelectedInstrument = instrument;
        this.setState({trackOptions: tempTrackOptions})
    }
    setCurrentSelectedOscillator = (oscillator) =>{
        let tempTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackOptions[foundIndex].currentSelectedOscillator = oscillator;
        this.setState({trackOptions: tempTrackOptions})
    };
    setCurrentPolyphony = (num) =>{
        let tempTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackOptions[foundIndex].currentPolyphony = num;
        this.setState({trackOptions: tempTrackOptions});
    };
    setCurrentADSR = (arr) =>{
        console.log(this.state.trackOptions);
        let tempTrackOptions = JSON.parse(JSON.stringify(this.state.trackOptions)); // why is this already updated??? am i updating it before somewhere..
        //let prevTrackOptions = [].concat(this.state.trackOptions);
        console.log(arr)
        console.log(tempTrackOptions)
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackOptions[foundIndex].currentADSR = arr;
        console.log(tempTrackOptions);
        this.setState({trackOptions: JSON.parse(JSON.stringify(tempTrackOptions))});
    };
    setPrevADSR = (arr) =>{
        
        let prevTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        prevTrackOptions[foundIndex].currentADSR = arr;
        console.log(arr)
        console.log(prevTrackOptions);
        this.setState({prevTrackOptions: prevTrackOptions});
    }
    setCurrentEffects = (arr) =>{
        // find currentSelectedTrack and set its currentEFfects to arr
        let tempTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        console.log(foundIndex);
        tempTrackOptions[foundIndex].currentEffects = arr;
        this.setState({trackOptions: tempTrackOptions})
    } 
    setTrackName = (name) =>{
        let tempTrackNames = this.state.trackNames;
        let foundIndex = this.state.trackNames.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackNames[foundIndex].name = name;
        this.setState({trackNames: tempTrackNames});
    }
    setTrackVolume = (val) =>{
        let tempTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackOptions[foundIndex].volume = val;
        this.setState({trackOptions: tempTrackOptions});
    }
    setTrackPan = (val) =>{
        let tempTrackOptions = [].concat(this.state.trackOptions);
        let foundIndex = this.state.trackOptions.findIndex((element)=>{
            return element.trackID === this.state.currentSelectedTrackID;
        });
        tempTrackOptions[foundIndex].pan = val;
        this.setState({trackOptions: tempTrackOptions});
    }
    setCurrentBPM = (e) =>{
        //const onlyNum = e.target.value.replace(/[^0-9]/g, '');
        //console.log(onlyNum)
        //this.setState({currentBPM: onlyNum});

        // must change the animation time of the playhead according to new bpm
        const re = /^[0-9\b]+$/;
        console.log(e.target.value)
        if(re.test(e.target.value)){
            this.setState({currentBPM: Number(e.target.value)}, ()=>{
                //let playheadResetPoint = _.maxBy(this.state.numPatterns, (element)=>{
                    //return element.num;
                //})*300; 
                let animTime = 1800 / (18.75 * this.state.currentBPM / 60);
                console.log(animTime);
                const tempCssProperties = {
                    'position': 'absolute',
                    'border': 'solid 1px purple',
                    'width': '2px',
                    'height': '100%',
                    //'background-color': 'purple',
                    'animation': 'playhead-move ' + animTime + 's linear infinite alternate',
                }
                this.setState({playheadCssProperties: tempCssProperties});
            });
        }else{
            this.setState({currentBPM: 120}, ()=>{
                //let playheadResetPoint = _.maxBy(this.state.numPatterns, (element)=>{
                    //return element.num;
                //})*300;
                const tempCssProperties = {
                    'position': 'absolute',
                    'border': 'solid 1px purple',
                    'width': '2px',
                    'height': '100%',
                    //'background-color': 'purple',
                    'animation': 'playhead-move 48s linear infinite alternate',
                }
                this.setState({playheadCssProperties: tempCssProperties});
            });
        }
    }
    setCurrentSongVolume = (e) =>{
        this.setState({currentSongVolume: Number(e.target.value)})
    }

    /*componentDidMount(){
        setTimeout(()=>{
            console.log("timeout");
            this.setState({restartAnimation: true}, ()=>{
                requestAnimationFrame(()=>{
                    this.setState({restartAnimation:false});
                })
            })
        }, 3000)
    }*/

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
        currentBPM: 120,
        currentSongVolume: 5,
        //v we can use this to insert patterns into the tracks {trackID, allSteps:array}
        currentSteps: [
            {trackID: 'track-1', trackSteps: []}, 
            {trackID: 'track-2', trackSteps: []},
            {trackID: 'track-3', trackSteps: []},
        ], 
        trackNames:[
            {trackID: 'track-1', name: 'Track 1'},
            {trackID: 'track-2', name: 'Track 2'},
            {trackID: 'track-3', name: 'Track 3'},
        ],
        currentSelectedTrackID: 'track-1', // use to check which track to insert pattern TODO: need to change this depending on which track is selected... maybe add an onclick or something for the trackcontainer
        numPatterns: [
            {trackID: 'track-1', num: 0},
            {trackID: 'track-2', num: 0},
            {trackID: 'track-3', num: 0},
        ],
        newPatternID: '',
        currentSelectedPatternID: '',
        currentPianoRollSteps: [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
        isPlaying: false,
        currentSelectedInstrument: 'amSynth',
        currentSelectedOscillator: 'triangle',
        currentPolyphony: 1,
        currentADSR:[30,30,30,30],
        currentEffects:[],
        trackOptions: [ // TODO: ADD AND DELETE HERE
            {
                trackID: 'track-1',
                currentSelectedInstrument: 'amSynth',
                currentSelectedOscillator: 'triangle',
                currentPolyphony: 1,
                currentADSR:[0.2,0.2,0.2,0.2],
                currentEffects:[],
                volume: -3,
                pan: 0,
            },
            {
                trackID: 'track-2',
                currentSelectedInstrument: 'amSynth',
                currentSelectedOscillator: 'triangle',
                currentPolyphony: 1,
                currentADSR:[0.2,0.2,0.2,0.2],
                currentEffects:[],
                volume: -3,
                pan: 0,
            },
            {
                trackID: 'track-3',
                currentSelectedInstrument: 'amSynth',
                currentSelectedOscillator: 'triangle',
                currentPolyphony: 1,
                currentADSR:[0.2,0.2,0.2,0.2],
                currentEffects:[],
                volume: -3,
                pan: 0,
            },
        ],
        prevTrackOptions: [],
        playheadCssProperties:{
            'position': 'absolute',
            'border': 'solid 1px purple',
            'width': '2px',
            'height': '100%',
            //'background-color': 'purple',
            'animation': 'playhead-move 48s linear infinite alternate',
        },
        playheadCssPropertiesInactive:{
            'position': 'absolute',
            'border': 'solid 1px purple',
            'width': '2px',
            'height': '100%',
            //'background-color': 'purple',
            'left': '200px',
        },
        restartAnimation: false,
        intervals:[],
    }
    render() {
        const {characters} = this.state; // why does this break without braces???
        let foundObject = this.state.trackOptions.find((element)=>{return element.trackID === this.state.currentSelectedTrackID});
      return(
        <div className="container">
          <h1>Oxygen</h1>
          <div id='app-level-buttons'>
            <Stack direction='row' sx={{mb: 1}} alignItems='center'>
                <button onClick={this.handleAppLevelPlayButtonClick}>
                    <img 
                        src={this.state.isPlaying ? process.env.PUBLIC_URL + "/stop.png" : process.env.PUBLIC_URL + "/play.png"} 
                        className='play-stop-button'
                    />
                </button>
                <TextField 
                    id='bpm-input' 
                    label='BPM' 
                    type='number' 
                    value={this.state.currentBPM}
                    onChange={this.setCurrentBPM} 
                />
                <label>Song Vol</label>
                <Box sx={{width: '300px'}}>
                    <Typography>{this.state.currentSongVolume + "dB"}</Typography>
                    <Slider 
                        id='song-volume-slider'
                        value={this.state.currentSongVolume}
                        onChange={this.setCurrentSongVolume}
                        min={0}
                        max={10}
                        step={0.1}
                        aria-label="Volume"
                        valueLabelDisplay='auto'
                    />
                </Box>
                
            </Stack>
          </div>
          <div className='main-components-container-div'>
            <div className='options-component-div'>
                <OptionsComponent 
                    setCurrentSelectedInstrument={this.setCurrentSelectedInstrument}
                    setCurrentSelectedOscillator={this.setCurrentSelectedOscillator}
                    setCurrentPolyphony={this.setCurrentPolyphony}
                    currentSelectedInstrument={this.state.currentSelectedInstrument}
                    setCurrentADSR={this.setCurrentADSR}
                    setPrevADSR={this.setPrevADSR}
                    currentADSR={this.state.currentADSR}
                    setCurrentEffects={this.setCurrentEffects}
                    currentSelectedTrackID={this.state.currentSelectedTrackID}
                    trackOptions={JSON.parse(JSON.stringify(this.state.trackOptions))}
                    trackNames={this.state.trackNames}
                    setTrackName={this.setTrackName}
                    setTrackVolume={this.setTrackVolume}
                    setTrackPan={this.setTrackPan}
                />
            </div>
            <button id='new-pattern-button' key='new-pattern-button' onClick={this.createNewPattern}>New Pattern</button>
            <button id='delete-pattern-button' key='delete-pattern-button' onClick={this.deletePattern}>Delete Pattern</button>
            <div className='track-piano-component-div'>
                <TrackContainer 
                    handlePatternClick={this.handlePatternClick}
                    newPatternID={this.state.newPatternID} // need to update this to track-#-pattern#
                    currentSteps={this.state.currentSteps}
                    updateSteps={(steps) => {this.updateSteps(steps)}}
                    handleCreateNewTrack={this.handleCreateNewTrack}
                    handleDeleteTrack={this.handleDeleteTrack}
                    handleTrackClick={this.handleTrackClick}
                    currentSelectedPatternID={this.state.currentSelectedPatternID}
                    currentPianoSteps={this.state.currentPianoRollSteps}
                    isSongPlaying={this.state.isPlaying}
                    currentEffects={this.state.currentEffects}
                    trackOptions={JSON.parse(JSON.stringify(this.state.trackOptions))}
                    currentBPM={this.state.currentBPM}
                    playheadCssProperties={this.state.playheadCssProperties}
                    playheadCssPropertiesInactive={this.state.playheadCssPropertiesInactive}
                    currentSongVolume={this.state.currentSongVolume}
                    prevTrackOptions={this.state.prevTrackOptions}
                    restartAnimation={this.state.restartAnimation}
                >
                </TrackContainer>
                
            
                <PianoRollComponent 
                    updateCurrentPianoRollSteps={this.updateCurrentPianoRollSteps}
                    currentPianoRollSteps={this.state.currentPianoRollSteps} // used when initially clicking on pattern
                    currentSelectedInstrument={foundObject.currentSelectedInstrument}
                    currentSelectedOscillator={foundObject.currentSelectedOscillator}
                    currentBPM={this.state.currentBPM}
                />
            </div>
            </div>
        </div>
      )
    }
  }

  export default App