import React, { Component, useState } from 'react';
import { Stack, Grid } from '@mui/material';
// only appear if the sample option is selected
// file selection doesnt work. use preset files 
class SampleSelector extends Component{
    constructor(props){
        super(props);
    }

    initialState = {
        paths:[],
    }
    state = this.initialState;

    handleChange = (e) =>{
        const newPath = e.target.files;
        console.log(newPath);
        console.log("here")
    }

    handleSamplePlay = (e) =>{
        const kick = new Audio(process.env.PUBLIC_URL + '/Kick Basic.wav')
        const clap = new Audio(process.env.PUBLIC_URL + '/Clap Basic.wav')
        const hat = new Audio(process.env.PUBLIC_URL + '/Hat Basic.wav')
        const snare = new Audio(process.env.PUBLIC_URL + '/Snare Basic.wav')
        let arr = [kick, clap, hat, snare];
        const selectedSample = e.target.value;
        // insert samples here and also send up and back down
        arr[e.target.value].play();
        
    }

    render(){
        return(
            <Stack>
                <label>Sampler</label>
                <Stack direction='row'>
                    <button onClick={this.handleSamplePlay} value={0}>Kick</button>
                    <button onClick={this.handleSamplePlay} value={1}>Clap</button>
                </Stack>
                <Stack direction='row'>
                    <button onClick={this.handleSamplePlay} value={2}>Hat</button>
                    <button onClick={this.handleSamplePlay} value={3}>Snare</button>
                </Stack>
                <label>Insert Sample</label>
                <div>
                    <input 
                        directory="" 
                        type="file" 
                        accept='image/*, audio/*'
                        onChange={this.handleChange}
                    />
                </div>
            </Stack>
        );
            
    }
}

export default SampleSelector;