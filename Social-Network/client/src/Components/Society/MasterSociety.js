import React, {Component} from 'react';
import Friends from "./Friends";
import Nav from "../Home/Header/Nav";
import LeftFixed from "../Home/LeftFixed";
import RightFixed from "../Home/RightFixed";
import "./mainSociety.css"

class MasterSociety extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         key: -1
    //     }
    // }
    //
    // getKey = (key) => {
    //     this.setState({key: key})
    // };

    render() {
        // console.log(this.state.key)
        return (
            <div>
                <Nav/>
                <div className="content">
                    <div className="wrapper">
                        <LeftFixed
                        />
                        <div className="mainnotfixed">
                            <Friends
                            />
                        </div>
                        <RightFixed
                        />
                    </div>
                </div>
            </div>

        );
    }
}

export default MasterSociety;
