/*
    NumberSelector.js
    Created by Howard Zhang, for COMP4905 Winter 2022

    Textbox with up and down arrows on the right hand side, used for both manually entering numeric data
    or incrementing/decrementing the current number
*/

import React, { Component, useState } from 'react';
import TextField from '@mui/material/TextField'


class NumberSelector extends Component{
    constructor(props){
        super(props);
        
    }

    initialState ={
        value: '',
    }
    state = this.initialState;

    handleChange = (e) =>{
        // replace non numbers
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        if(onlyNums >12){
            this.setState({value: 1}, ()=>{
                this.props.setValue(this.state.value);
                //this.props.setCurrentPolyphony(this.state.value)
            }); 
        }else if(onlyNums <1){
            this.setState({value: 12}, ()=>{
                this.props.setValue(this.state.value);
                //this.props.setCurrentPolyphony(this.state.value)
            });
        }else{
            this.setState({value: onlyNums}, ()=>{
                this.props.setValue(this.state.value);
                //this.props.setValue(this.state.value)
            });
        }
        
    }

    render(){
        return(
            <div>
                <label>
                    {this.props.label}
                    <TextField
                        type="number"
                        onChange={this.handleChange}
                        value={this.props.value}
                    />
                </label>
            </div>
        )
    }
}
export default NumberSelector;