import { render } from '@testing-library/react';
import React, {Component} from 'react';

const SimpleComponent = () =>{
    return <div>Example</div>
}

class ClassComponent extends Component{
    render(){
        return(
            <SimpleComponent/>
        )
    }
}

export default SimpleComponent