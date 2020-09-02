import React, {Component} from 'react';
import "./css/main.css"
import $ from 'jquery';
import ListUsers from "./ListUsers";
import ChatFrame from "./ChatFrame";
import {connect} from "react-redux";
import * as messageActions from "../../Actions/message.action";
import * as configSocket from "../../socket/configSocket";


class MasterMessage extends Component {
    constructor(props) {
        super(props);

    }


    // showMessage = () => {
    //     $('.friend-drawer--onhover').on('click', function () {
    //
    //         $('.chat-bubble').hide('slow').show('slow');
    //
    //     });
    // };

    componentDidMount() {
        configSocket.config();
        const {match: {params}} = this.props;
        this.props.getChatGroupId(params.conversationId);
        this.props.getMessagesByParamsId(params.conversationId);
        this.props.getContactsByStatusIsTrue();
        // conversationChat.style.display = "block"
    }

    render() {
        return (
            <div className="master-message">
                <div className="container">
                    <div className="row no-gutters">
                        <ListUsers/>
                        <ChatFrame/>

                    </div>
                </div>
                <div id="footer">
                    <div className="foot">
                        <div className="social text-center">
                            <a href="https://www.facebook.com/phamminhtuan.317" target="_blank"
                               rel="noopener noreferrer">
                                <i className="fab fa-facebook"/>
                            </a>
                            <a href="https://www.facebook.com/groups/nhompi2020/" target="_blank"
                               rel="noopener noreferrer">
                                <i className="fas fa-users"/>
                            </a>
                            <a href="#1" target="_blank">
                                <i className="fab fa-font-awesome-flag"/>
                            </a>
                            <a href="#1">
                                <i className="fab fa-youtube"/>
                            </a>
                        </div>

                        <p>Copyright © Tuan Pham 2020 All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    getChatGroupId: (conversationId) => dispatch(messageActions.getChatGroupId(conversationId)),
    getContactsByStatusIsTrue: () => dispatch(messageActions.getContactsByStatusIsTrue()),
    getMessagesByParamsId: (conversationId) => dispatch(messageActions.getMessagesByParamsId(conversationId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MasterMessage);
