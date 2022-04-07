import React, { Component, useState } from 'react';
import { Sampler } from 'tone';
import DropdownList from './DropdownList';
import NumberSelector from './NumberSelector';
import SampleSelector from './SampleSelector';
import Slider from '@mui/material/Slider';
import {Effect} from 'reactronica';
import { TextField, Typography, Stack, Grid } from '@mui/material';

// rendered by EffectsControls
class EffectContainer extends Component{
    constructor(props){
        super(props);
    }

    initialState = {
        wetValue: this.props.wetValue,
    };
    state = this.initialState;

    handleChange = (e) =>{
        
        this.setState({wetValue: e.target.value}, ()=>{
            this.props.handleSliderChange(this.props.effectValue, e.target.value);
        }); // TODO: need to send this up, update array in app.js
        // create new array based on the old one, fill with new value
        // send up to app.js
        // app.js will send down to trackcontainer
        
    }

    handleEffectDelete = () => {
        this.props.handleDeleteEffectClick(this.props.effectValue);
    }

    render(){
        // <Effect type={this.props.effectName} wet={this.state.wetValue}/>
        return(
            <div>
                <label>{this.props.effectName}</label>
                <label>
                    Wet
                    <Slider value={this.state.wetValue} onChange={this.handleChange} min={0} max={1} step={0.01}/>
                </label>
                <button id='effectDeleteButton' onClick={this.handleEffectDelete}>Delete</button>
            </div>
        );
    }
}

class EffectsControls extends Component{
    constructor(props){
        super(props);
    }
    initialState = {
        effectToAdd: {key: 'autoFilter', value: 'autoFilter', name: 'Auto Filter', wet: 0.2},
        currentEffects: this.props.trackOptions[this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        })].currentEffects, // TODO: store effects as objects so that we can send them back up
        // ^^ this might not work...
    }
    state = this.initialState;

    // use this to display the corresponding effects upon currentSelectedTrackChange
    componentDidUpdate(prevProps){
        if(prevProps.currentSelectedTrackID !== this.props.currentSelectedTrackID){
            this.setState({currentEffects: this.props.trackOptions[this.props.trackOptions.findIndex((element)=>{
                return element.trackID === this.props.currentSelectedTrackID;
            })].currentEffects});
        }
    }

    EffectDropdownListItems = [
        {key: 'autoFilter', name: 'Auto Filter', value: 'autoFilter'},
        {key: 'autoPanner', name: 'Auto Panner', value: 'autoPanner'},
        {key: 'autoWah', name: 'Auto Wah', value: 'autoWah'},
        {key: 'bitCrusher', name: 'Bitcrusher', value: 'bitCrusher'},
        {key: 'distortion', name: 'Distortion', value: 'distortion'},
        {key: 'feedbackDelay', name: 'Feedback Delay', value: 'feedbackDelay'},
        {key: 'freeverb', name: 'Freeverb', value: 'freeverb'},
        {key: 'panVol', name: 'Pan Volume', value: 'panVol'},
        {key: 'tremolo', name: 'Tremolo', value: 'tremolo'},
    ];

    setChosenEffect = (effect) =>{
        let foundItem = this.EffectDropdownListItems.find((element)=>{
            return element.value === effect;
        })
        // TODO: need to restrict number of added effects
        this.setState({effectToAdd: {key: foundItem.value, name: foundItem.name, value: foundItem.value}});
    }

    handleAddEffectClick = () =>{
        let tempEffects = this.state.currentEffects;
        // look through currentEffects to search for duplicates, if duplicate, reject

        let dupe = tempEffects.find((element)=>{
            return element.key === this.state.effectToAdd.key;
        })

        if(dupe == undefined){
            tempEffects.push(this.state.effectToAdd);
            this.props.setCurrentEffects(tempEffects);
        }
        // TODO: notify the user here?
        //this.setState({currentEffects: tempEffects});
    }

    handleSliderChange = (effectKey, val) =>{
        let tempCurrentEffects = this.state.currentEffects;
        let foundIndex = tempCurrentEffects.findIndex((element)=>{
            return element.key === effectKey;
        });
        tempCurrentEffects[foundIndex].wet = val;
        this.props.setCurrentEffects(tempCurrentEffects);
        //this.setState({currentEffects: tempCurrentEffects}, ()=>{
            
        //});
    }

    handleDeleteEffectClick = (key) =>{
        let tempCurrentEffects = this.state.currentEffects;
        let foundIndex = tempCurrentEffects.findIndex((element)=>{
            return element.key === key;
        });
        tempCurrentEffects.splice(foundIndex, 1);
        this.setState({currentEffects: tempCurrentEffects});
    }

    render(){
        let effectsToRender = [];
        let tempCurrentEffects = this.state.currentEffects;
        for(let i = 0; i<tempCurrentEffects.length; i++){
            effectsToRender.push(
                <EffectContainer 
                    key={tempCurrentEffects[i].value}
                    effectValue={tempCurrentEffects[i].value}
                    effectName={tempCurrentEffects[i].name} 
                    wetValue={0.2}
                    handleSliderChange={this.handleSliderChange}
                    handleDeleteEffectClick={this.handleDeleteEffectClick}
                />
            );
        }
        return(
            <div> 
                <label>Effects</label>
                <div className='effects-container-div'>
                    {effectsToRender}
                </div>
                <DropdownList label='Effect' items={this.EffectDropdownListItems} setValue={this.setChosenEffect}/>
                <button id={"addEffectButton"} onClick={this.handleAddEffectClick}>+ Add Effect</button>
            </div>
        );
    }
}

class MainControls extends Component{
    constructor(props){
        super(props);
    }
    foundIndex = this.props.trackOptions.findIndex((element)=>{
        return element.trackID === this.props.currentSelectedTrackID;
    });
    initialState = {
        currentSelectedInstrument: this.props.trackOptions[this.foundIndex].currentSelectedInstrument,
        currentSelectedOscillator: this.props.trackOptions[this.foundIndex].currentSelectedOscillator,
        currentPolyphony: this.props.trackOptions[this.foundIndex].currentPolyphony,
        //currentADSR: this.props.currentADSR,
        currentADSR: this.props.trackOptions[this.foundIndex].currentADSR,
        currentVolume: this.props.trackOptions[this.foundIndex].volume,
        currentPan: this.props.trackOptions[this.foundIndex].pan,
    }
    state = this.initialState;
    //handleInstrumentTypeOnChange = (event) =>{
        //this.props.setCurrentSelectedInstrument(event.target.)
    //}

    // TODO: need to figure out why this (the stuff im setting below) won't update -- because the track doesnt change xd
    componentDidUpdate(prevProps){
        if(prevProps.currentSelectedTrackID !== this.props.currentSelectedTrackID){
            let foundIndex = this.props.trackOptions.findIndex((element)=>{
                return element.trackID === this.props.currentSelectedTrackID;
            });
            console.log(this.props.trackOptions[foundIndex].currentSelectedInstrument)
            this.setState({
                currentSelectedInstrument: this.props.trackOptions[foundIndex].currentSelectedInstrument,
                currentSelectedOscillator: this.props.trackOptions[foundIndex].currentSelectedOscillator,
                currentPolyphony: this.props.trackOptions[foundIndex].currentPolyphony,
                //currentADSR: this.props.currentADSR,
                currentADSR: [].concat(this.props.trackOptions[foundIndex].currentADSR),
            })
        }
    }

    // untested... please test
    handleSliderChange = (e) =>{
        let foundIndex1 = this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        });
        console.log(this.props.trackOptions); // changes before
        let tempADSR = [].concat(this.props.trackOptions[foundIndex1].currentADSR); // might need to change this according to the currently selected track
        const ADSRIDarray = ['attack-slider', 'decay-slider', 'sustain-slider', 'release-slider'];
        let foundIndex = 0;
        console.log(tempADSR[0]); 
        //this.props.setCurrentADSR(tempADSR); this doesnt work; somehow magically updates adsr array before i can get to it idek  
        for(let i = 0; i<ADSRIDarray.length; i++){
            if(ADSRIDarray[i] === e.target.name){
                foundIndex = i;
                break;
            } 
        }
        tempADSR[foundIndex] = e.target.value;
        
        this.setState({currentADSR: tempADSR}, ()=>{
            console.log(this.props.trackOptions[foundIndex1].currentADSR);
            console.log(tempADSR[0]); 
            this.props.setCurrentADSR(tempADSR);
        });
    }

    handleVolumeChange = (e) =>{
        this.props.setTrackVolume(e.target.value);
        this.setState({currentVolume: e.target.value});
    }

    handlePanChange = (e) =>{
        this.props.setTrackPan(e.target.value);
        this.setState({currentPan: e.target.value});
    }

    render(){
        let instrumentList = [
            {key: 'amSynth', name: 'AM Synth', value: 'amSynth'},
            {key: 'duoSynth', name: 'Duo Synth', value: 'duoSynth'},
            {key: 'fmSynth', name: 'FM Synth', value: 'fmSynth'},
            {key: 'membraneSynth', name: 'Membrane Synth', value: 'membraneSynth'},
            {key: 'metalSynth', name: 'Metal Synth', value: 'metalSynth'},
            {key: 'monoSynth', name: 'Mono Synth', value: 'monoSynth'},
            {key: 'pluckSynth', name: 'Pluck Synth', value: 'pluckSynth'},
            {key: 'sampler', name: 'Sampler', value: 'sampler'},
            {key: 'synth', name: 'Synth', value: 'synth'},
        ];
        let oscillatorList = [
            {key: 'triangle', name: 'Triangle', value: 'triangle'},
            {key: 'sine', name: 'Sine', value: 'sine'},
            {key: 'square', name: 'Square', value: 'square'},
        ];
        let foundIndex = this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        });
        return(
            <div>
                <DropdownList label='Instrument' items={instrumentList} setValue={this.props.setCurrentSelectedInstrument} value={this.props.trackOptions[foundIndex].currentSelectedInstrument}/>
                {this.props.trackOptions[foundIndex].currentSelectedInstrument === 'membraneSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'monoSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'synth' ? 
                <DropdownList 
                    label='Oscillator Type' 
                    items={oscillatorList} 
                    setValue={this.props.setCurrentSelectedOscillator} 
                    value={this.props.trackOptions[foundIndex].currentSelectedOscillator} 
                    disabled={this.props.trackOptions[foundIndex].currentSelectedInstrument === 'membraneSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'monoSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'synth' ? false : true}
                    //className={this.props.trackOptions[foundIndex].currentSelectedInstrument === 'membraneSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'monoSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'synth' ? null: 'dropdown:disabled'}
                /> : null}
                
                <NumberSelector label='Polyphony' setValue={this.props.setCurrentPolyphony} value={this.props.trackOptions[foundIndex].currentPolyphony}/> 
                {this.props.trackOptions.find((element)=>{return element.trackID === this.props.currentSelectedTrackID}).currentSelectedInstrument === 'sampler' ? <SampleSelector /> : null}
                
                <Grid container justifyContent='space-between'>
                    <Typography align='left' sx={{fontWeight: 'bold'}}>
                        {'Volume'}
                    </Typography> 
                    <Typography align='right'>{this.state.currentVolume + "dB"}</Typography>
                </Grid>
                <Slider name='volume-slider' defaultValue={-3} min={-10} max={10} step={0.01} onChange={this.handleVolumeChange} valueLabelDisplay='auto'/>
                
                <Grid container justifyContent='space-between'>
                    <Typography align='left' sx={{fontWeight: 'bold'}}>
                        {'Pan'}
                    </Typography> 
                    <Typography align='right'>{this.state.currentPan + "% " + (this.state.currentPan < 0 ? "L" : "R")}</Typography>
                </Grid>
                <Slider name='pan-slider' defaultValue={0} min={-100} max={100} onChange={this.handlePanChange} valueLabelDisplay='auto'/>

                <div className={'adsr-div'}>
                    <Grid container justifyContent='space-between'>
                        <Typography key='attack-slider' align='left' sx={{fontWeight: 'bold'}}>
                            {'Attack'}
                        </Typography>
                        <Typography align='right'>{this.state.currentADSR[0]}</Typography>
                    </Grid>
                    <Slider name='attack-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[0]} valueLabelDisplay='auto'/>
                    
                    <Grid container justifyContent='space-between'>
                        <Typography key='decay-slider'align='left' sx={{fontWeight: 'bold'}}>
                            {'Decay'}
                        </Typography>
                        <Typography align='right'>{this.state.currentADSR[1]}</Typography>
                    </Grid> 
                    <Slider name='decay-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[1]} valueLabelDisplay='auto'/>
                    
                    <Grid container justifyContent='space-between'>
                        <Typography key='sustain-slider' align='left' sx={{fontWeight: 'bold'}}>
                            {'Sustain'}
                        </Typography>
                        <Typography align='right'>{this.state.currentADSR[2]}</Typography>
                    </Grid> 
                    <Slider name='sustain-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[2]} valueLabelDisplay='auto'/>
                    
                    <Grid container justifyContent='space-between'>
                        <Typography key='release-slider' align='left' sx={{fontWeight: 'bold'}}>
                            {'Release'}
                        </Typography>
                        <Typography align='right'>{this.state.currentADSR[3]}</Typography>
                    </Grid> 
                    <Slider name='release-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[3]} valueLabelDisplay='auto'/>

                </div>
            </div>
        );
    }
}

class OptionsComponent extends Component{
    constructor(props){
        super(props);
    }

    handleTrackNameChange = (e) =>{
        this.props.setTrackName(e.target.value);
    }

    render(){
        return(
            <div className='options-component'>
                <div>
                    <TextField 
                        id='track-name-textfield' 
                        label='Track Name' variant='outlined' 
                        value={this.props.trackNames.find((element)=>{return element.trackID === this.props.currentSelectedTrackID;}).name}
                        onChange={this.handleTrackNameChange}
                    />
                </div>
                <div>
                    <MainControls 
                        setCurrentSelectedInstrument={this.props.setCurrentSelectedInstrument}
                        setCurrentSelectedOscillator={this.props.setCurrentSelectedOscillator}
                        setCurrentPolyphony={this.props.setCurrentPolyphony}
                        currentSelectedInstrument={this.props.currentSelectedInstrument}
                        setCurrentADSR={this.props.setCurrentADSR}
                        currentADSR={this.props.currentADSR}
                        setPrevADSR={this.props.setPrevADSR}
                        currentSelectedTrackID={this.props.currentSelectedTrackID}
                        trackOptions={JSON.parse(JSON.stringify(this.props.trackOptions))}
                        setTrackVolume={this.props.setTrackVolume}
                        setTrackPan={this.props.setTrackPan}
                    />
                </div>
                <div>
                    <EffectsControls 
                        setCurrentEffects={this.props.setCurrentEffects}
                        currentSelectedTrackID={this.props.currentSelectedTrackID}
                        trackOptions={this.props.trackOptions}
                    />
                </div>
            </div>
        );  
    }
}

export default OptionsComponent;