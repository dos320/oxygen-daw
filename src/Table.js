import React, {Component} from 'react';

const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>Name</th>
                <th>Job</th>
            </tr>
        </thead>
    )
}

const TableBody = (props) => { // must use props this way if we are using a stateless component
    const rows = props.characterData.map((row, index) => {
        return(
            <tr key={index}>
                <td>{row.name}</td>
                <td>{row.job}</td>
                <td>
                    <button onClick={() =>{props.removeCharacter(index)}}>Delete</button>
                </td>
            </tr>
        )
    })
    return(<tbody>{rows}</tbody>)
}

const Table = (props) => {
    const {characterData, removeCharacter} = props;
        
    return (
        <table>
            <TableHeader />
            <TableBody characterData={characterData} removeCharacter={removeCharacter}/>
        </table>
        
    )
}
/*
class Table extends Component{ // use this.props if there we are using a class component
    render(){
        const {characterData, removeCharacter} = this.props;
        return (
            <table>
                <TableHeader />
                <TableBody characterData={characterData} removeCharacter={removeCharacter}/>
            </table>
            
        )
    }
}
*/



export default Table