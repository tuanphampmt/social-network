import React, {Component} from 'react';

class AddressEdit extends Component {
    render() {
        return (
            <div className="modal animate">
                <div className="Edit">
                    <span className="close" title="Close Modal">×</span>
                    <h2 align="center">Address Edit</h2>
                    <form action="#" onSubmit="return false">
                        <br/>
                        <label>Country</label>
                        <br/>
                        <input type="text" name="country" placeholder="Enter Country" required/>
                        <br/>
                        <label>City</label>
                        <br/>
                        <input type="text" name="city" placeholder="Enter State" required/>
                        <br/>
                        <label>District</label>
                        <br/>
                        <input type="text" name="district" placeholder="Enter District" required/>
                        <br/>
                        <label>Village</label>
                        <br/>
                        <input type="number" name="village" placeholder="Enter ZIP code" required/>
                        <br/>
                        <label>Street</label>
                        <br/>
                        <input type="number" name="street" placeholder="Enter ZIP code" required/>
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

export default AddressEdit;