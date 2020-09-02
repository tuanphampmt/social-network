import React, {Component} from 'react';

class MoreEdit extends Component {
    render() {
        return (
            <div className="modal animate">
                <div className="Edit">
                    <span className="close" title="Close Modal">×</span>
                    <h2 align="center">More About You Edit</h2>
                    <form action="#" onSubmit="return false">
                        <br/>
                        <label htmlFor="interest">Relationship</label>
                        <br/>
                        <select style={{
                            width: '100%',
                            padding: '10px 16px',
                            margin: '12px 0',
                            display: 'inline-block',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                            borderRadius: '5px',
                            fontSize: '14px'
                        }} title="Interest" id="interest">
                            <option value="Relationship">Relationship</option>
                            <option value="độc thân">Độc thân</option>
                            <option value="Woman">Đã có người yêu</option>
                            <option value="Men and Woman">Đã có gia đình</option>
                            <option value="Men and Woman">Đang hẹn hò</option>
                        </select>
                        <br/>
                        <label htmlFor="interest">Interest In</label>
                        <br/>
                        <select style={{
                            width: '100%',
                            padding: '10px 16px',
                            margin: '12px 0',
                            display: 'inline-block',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                            borderRadius: '5px',
                            fontSize: '14px'
                        }} title="Interest" id="interest">
                            <option value="Interest In">Interest In</option>
                            <option value="Men">Nam</option>
                            <option value="Woman">Nữ</option>
                            <option value="Men and Woman">Nam và Nữ</option>
                        </select>
                        <br/>
                        <label>Hobby</label>
                        <br/>
                        <input type="text" name="hobby" placeholder="Enter Hobby" required/>
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

export default MoreEdit;