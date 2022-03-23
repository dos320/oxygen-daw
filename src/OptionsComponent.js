import React, { Component, useState } from 'react';
import { Sampler } from 'tone';
import DropdownList from './DropdownList';
import NumberSelector from './NumberSelector';
import SampleSelector from './SampleSelector';
import Slider from '@mui/material/Slider';
import {Effect} from 'reactronica';
import { TextField } from '@mui/material';

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

    render(){
        // <Effect type={this.props.effectName} wet={this.state.wetValue}/>
        return(
            <div>
                <label>{this.props.effectName}</label>
                <label>
                    Wet
                    <Slider value={this.state.wetValue} onChange={this.handleChange} min={0} max={1} step={0.01}/>
                </label>
                <button>Delete</button>
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
        tempEffects.push(this.state.effectToAdd);
        
        this.props.setCurrentEffects(tempEffects);
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

    render(){
        let effectsToRender = [];
        let tempCurrentEffects = this.state.currentEffects;
        for(let i = 0; i<tempCurrentEffects.length; i++){
            effectsToRender.push(
                <EffectContainer 
                    effectValue={tempCurrentEffects[i].value}
                    effectName={tempCurrentEffects[i].name} 
                    wetValue={0.2}
                    handleSliderChange={this.handleSliderChange}
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

    initialState = {
        currentSelectedInstrument: this.props.trackOptions[this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        })].currentSelectedInstrument,
        currentSelectedOscillator: this.props.trackOptions[this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        })].currentSelectedOscillator,
        currentPolyphony: this.props.trackOptions[this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        })].currentPolyphony,
        //currentADSR: this.props.currentADSR,
        currentADSR: this.props.trackOptions[this.props.trackOptions.findIndex((element)=>{
            return element.trackID === this.props.currentSelectedTrackID;
        })].currentADSR,
    }
    state = this.initialState;
    //handleInstrumentTypeOnChange = (event) =>{
        //this.props.setCurrentSelectedInstrument(event.target.)
    //}

    // TODO: need to figure out why this (the stuff im setting below) won't update
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
                currentADSR: this.props.trackOptions[foundIndex].currentADSR,
            })
        }
    }

    // untested... please test
    handleSliderChange = (e) =>{
        let tempADSR = this.state.currentADSR; // might need to change this according to the currently selected track
        const ADSRIDarray = ['attack-slider', 'decay-slider', 'sustain-slider', 'release-slider'];
        let foundIndex = 0;
        
        for(let i = 0; i<ADSRIDarray.length; i++){
            if(ADSRIDarray[i] === e.target.name){
                foundIndex = i;
                break;
            } 
        }
        tempADSR[foundIndex] = e.target.value;

        this.props.setCurrentADSR(tempADSR);
    }

    handleVolumeChange = (e) =>{
        this.props.setTrackVolume(e.target.value);
    }

    handlePanChange = (e) =>{
        this.props.setTrackPan(e.target.value);
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
                <DropdownList 
                    label='Oscillator Type' 
                    items={oscillatorList} 
                    setValue={this.props.setCurrentSelectedOscillator} 
                    value={this.props.trackOptions[foundIndex].currentSelectedOscillator} 
                    disabled={this.props.trackOptions[foundIndex].currentSelectedInstrument === 'membraneSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'monoSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'synth' ? false : true}
                    className={this.props.trackOptions[foundIndex].currentSelectedInstrument === 'membraneSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'monoSynth' || this.props.trackOptions[foundIndex].currentSelectedInstrument === 'synth' ? null: 'dropdown:disabled'}
                />
                <NumberSelector label='Polyphony' setValue={this.props.setCurrentPolyphony} value={this.props.trackOptions[foundIndex].currentPolyphony}/> 
                <label>
                    {'Volume'}
                    <Slider name='volume-slider' defaultValue={-3} min={-10} max={10} step={0.01} onChange={this.handleVolumeChange}/>
                </label>
                <label>
                    {'Pan'}
                    <Slider name='pan-slider' defaultValue={0} min={-100} max={100} onChange={this.handlePanChange}/>
                </label>
                {this.props.currentSelectedInstrument === 'sampler' ? <SampleSelector /> : null}
                <div className={'adsr-div'}>
                    <label key='attack-slider'>
                        {'Attack'}
                        <Slider name='attack-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[0]}/>
                    </label>
                    <label key='decay-slider'>
                        {'Decay'}
                        <Slider name='decay-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[1]}/>
                    </label>
                    <label key='sustain-slider'>
                        {'Sustain'}
                        <Slider name='sustain-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[2]}/>
                    </label>
                    <label key='release-slider'>
                        {'Release'}
                        <Slider name='release-slider' defaultValue={0.2} max={1} step={0.01} onChange={this.handleSliderChange} value={this.props.trackOptions[foundIndex].currentADSR[3]}/>
                    </label>
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
                        currentSelectedTrackID={this.props.currentSelectedTrackID}
                        trackOptions={this.props.trackOptions}
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