import React, { Component, useState } from 'react';
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

    render(){
        return(
            <div>
                <input 
                    directory="" 
                    type="file" 
                    accept='image/*, audio/*'
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default SampleSelector;