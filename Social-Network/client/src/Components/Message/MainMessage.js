// import React, {Component} from 'react';
// import Nav from "../Home/Header/Nav";
// import RightFixed from "../Home/RightFixed";
// import LeftFixed from "../Home/LeftFixed";
//
// import Message from "./Message";
// const user = JSON.parse(localStorage.getItem('user'));
//
// let increm = 3;
//
// class MainMessage extends Component {
//     constructor(props) {
//         super(props);
//     }
//
//     componentDidMount() {
//         const {match: {params}} = this.props;
//         // this.props.getFollower()
//     }
//
//     loadontact = () => {
//         for (let i = 1; i <= 29; i++) {
//             const contacts = document.getElementsByClassName("contacts");
//             const contactuser = document.createElement("div");
//             contactuser.className = "contactuser";
//             contacts[0].appendChild(contactuser);
//             const onclick = "select(" + increm + ")";
//             contactuser.setAttribute("onclick", onclick);
//             const userimg = document.createElement("img");
//             userimg.className = "contimg";
//             userimg.src = "../images/profile/other_profile.png";
//             contactuser.appendChild(userimg);
//             const para = document.createElement("p");
//             para.className = "name";
//             const text = document.createTextNode("User Name");
//             para.appendChild(text);
//             contactuser.appendChild(para);
//             increm++;
//         }
//         setTimeout(this.chatmsgrec(), 600);
//     };
//
//
//     chatmsgrec = () => {
//         const received = document.getElementsByClassName("received");
//         received[0].style.display = "block";
//         // chat msg hi send after 6ms
//         setTimeout(this.chatmsgsend(), 600);
//     };
//
//     chatmsgsend = () => {
//         const send = document.getElementsByClassName("send");
//         send[0].style.display = "block";
//         // chat msg how are you? received after 8ms
//         setTimeout(this.chatmsgrec1(), 800);
//     };
//
//     chatmsgrec1 = () => {
//         const received = document.getElementsByClassName("received");
//         received[1].style.display = "block";
//     };
//
//
//     sendmsg = () => {
//         const textarea = document.getElementById("textarea");
//         const chat = document.getElementsByClassName("chatmsg");
//
//         const send = document.createElement("div");
//         send.className = "send";
//
//         const paapa = textarea.value.replace(/\s/g, "\u00a0");
//         textarea.value = "";
//
//         const sendpara = document.createElement("p");
//         const text3 = document.createTextNode(paapa);
//         sendpara.appendChild(text3);
//
//         send.appendChild(sendpara);
//         send.style.display = "block";
//
//         chat[0].appendChild(send);
//         chat[0].scrollTop = chat[0].scrollHeight;
//     };
//
//     render() {
//         return (
//             <div>
//                 <Nav/>
//                 <div className="content">
//                     <div className="wrapper">
//                         <LeftFixed/>
//                         <Message/>
//                         <RightFixed/>
//                     </div>
//                 </div>
//
//             </div>
//
//         )
//     }
// }
//
// export default MainMessage;
