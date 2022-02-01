import React, {Component} from 'react'

class Form extends Component{
    submitForm = () => {
        this.props.handleSubmit(this.state) // use this.props for referring to the props that are passed to the CLASS
        this.setState(this.initialState) // reset to this
    }

    handleChange = (event) =>{
        const {name, value} = event.target;

        this.setState({
           [name]: value, 
        })
    }
    
    initialState = { // empty template that we reset to afterwards.
        name: '',
        job: '',
    }
    state = this.initialState;

    render(){
        const {name, job} = this.state;

        return(
            <form>
                <label htmlFor="name">Name</label>
                <input 
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={this.handleChange}
                 />
                 <label htmlFor="job">Job</label>
                 <input
                    type="text"
                    name="job"
                    id="job"
                    value={job}
                    onChange={this.handleChange}
                 />
                 <input type="button" value="submit" onClick={this.submitForm}/>
            </form>
        );
    }
}
export default Form

