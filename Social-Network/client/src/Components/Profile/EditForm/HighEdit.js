import React, {Component} from 'react';

class HighEdit extends Component {
    render() {
        return (
            <div className="modal animate">
                <div className="Edit">
                    <span className="close" title="Close Modal">&times;</span>
                    <h2 align="center">High School Education Edit</h2>
                    <form action="#" onSubmit="return false">
                        <br/>
                        <label>High School</label>
                        <br/>
                        <input type="text" name="hschool" placeholder="Enter Primary School" required/>
                        <br/>
                        <label>Start Year</label>
                        <label style={{position: 'absolute', left: '50.6%'}}>End
                            Year</label>
                        <br/>
                        <input style={{width: '49%'}} type="number" name="syear1" placeholder="Start Year"
                               min={1970} max={2017} required/>
                        <input style={{width: '49%'}} type="number" name="eyear1" placeholder="End Year"
                               min={1970} required/>
                        <br/>
                        <button type="submit">Update</button>
                        <br/>
                        <button type="button" className="cancelbtn">Cancel</button>
                        <br/>
                    </form>
                </div>
            </div>
        );
    }
}

export default HighEdit;