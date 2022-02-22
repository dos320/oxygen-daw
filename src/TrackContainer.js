import { render } from '@testing-library/react';
import { typeImplementation } from '@testing-library/user-event/dist/type/typeImplementation';
import React, { Component, useState } from 'react';
import {Song, Track, Instrument} from 'reactronica';

class TrackControl extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
            </>
        );
    }
}

class TrackPatternContainer extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <>
            </>
        );
    }
}

class TrackView extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(<>
            <Track>
                <TrackControl></TrackControl>
                <TrackPatternContainer></TrackPatternContainer>
            </Track>
            </>
        );
    }
}

const TrackContainer = (props) =>{
    return(
        <>
        <div>
            test
        </div>
        </>
    );
}
export default TrackContainer;