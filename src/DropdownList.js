/*
    DropdownList.js
    Created by Howard Zhang, for COMP4905 Winter 2022

    Modified HTML select that uses prop and state
*/

import React, { Component } from 'react';

// props: label, list of items, onChange
class DropdownList extends Component{

    initialState = {
        value: '',
    };
    state = this.initialState;

    handleValueChange = (e) =>{
        this.props.setValue(e.target.value);
    }

    render(){
        let itemsToAdd = [] // <option value=""></option>
        for(let i = 0; i<this.props.items.length; i++){
            itemsToAdd.push(<option key={'option' + i} value={this.props.items[i].value}>
                    {this.props.items[i].name}
                </option>
            );
        }

        return(
            <div>
                <label>
                    {this.props.label}
                    <select value={this.props.value} onChange={this.handleValueChange} disabled={this.props.disabled} className={this.props.className}>
                        {itemsToAdd}
                    </select>
                </label>
            </div>
        );
    }
}

export default DropdownList;