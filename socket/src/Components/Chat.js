import React, { useState } from 'react'
import axios from 'axios'
//import bcrypt from 'bcrypt';
// import crypto from "crypto"
// import polyfills from "polyfills"
import { sha512 } from 'js-sha512';
let newSocket=null;
export default function Chat() {
    const [userdetails,setusedetails]=useState({
        username:"",
        password:"",
        number:""
    })
    const [onlinelist,setonlinelist]=useState([])
    const [namedata,setnamedata]=useState("")
    const [publicChats, setPublicChats] = useState([]);
    const[check ,setcheck]=useState({
        check1:false,
        check2:false
    })
    const[login,setlogin]=useState({
        number1:"",
        password1:""
    })
    const [userData, setUserData] = useState({
        username: "",
        message: ''
      });
      function containsSpecialChars(str) {
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return specialChars.test(str);
      }
    const signup=async()=>{
        console.log(userdetails)
        console.log(sha512.hmac('1',userdetails.password ))
        if( containsSpecialChars(userdetails.password) ){        
            const result=await axios.post(`http://localhost:8081/web/post1/${userdetails.username}/${sha512.hmac('1',userdetails.password )}/${userdetails.number}`)
            console.log(result)
            if (result.data==="change user name"){
                alert('change user name')
            }
            else{
                setcheck({...check,check2:false})
            }
        }else{
            setusedetails({...userdetails,password:""})
            alert('Should contain a special symbol')
        }
        //setcheck({...check,check2:false})
    }
    const autherfication=async()=>{
        sha512.hmac('1', login.password1)
        console.log(sha512.hmac('1', login.password1))
        var result= await axios.get(`http://localhost:8081/web/put/${login.number1}/${sha512.hmac('1', login.password1)}`)
        var result1= await axios.get(`http://localhost:8081/web/gets1/${login.number1}/${sha512.hmac('1', login.password1)}`)
        setInterval(async()=>{var result2=await axios.get(`http://localhost:8081/web/online`)
        var newonline=[]
        result2.data.map((nmae,index)=>{
            if (nmae===result1.data){
                newonline.push("Group")
            }
            else{
                newonline.push(nmae)
            }
        })
        setonlinelist(newonline)},100)
        setUserData({...userData,username:result1.data})
        console.log(result.data)
        if (result.data)
        {
            setcheck({...check,check1:true})
            const newSocket1 = new WebSocket('ws://localhost:8081/chat');
            newSocket1.onopen = (event) => 
            {
                console.log("connected")
                newSocket1.send(JSON.stringify({usernam1:result1.data,message:"identity",sender1:"server"}))
            };
            console.log(check.check1)
            newSocket=newSocket1
            newSocket1.onmessage = (event) => 
            {
                const data1 = JSON.parse(event.data);
                console.log(data1)
                publicChats.push(data1);
                setPublicChats([...publicChats]); 
            };
        }
        else{
            alert('incorrect credentials')
        }
            newSocket.onclose=()=>{
                console.log("closed")
            }
            
    }
    const logoutfunction=async()=>{
        newSocket.close();
        setcheck({...check,check1:false})
        await axios.put(`http://localhost:8081/web/put/${login.number1}/${sha512.hmac('1', login.password1)}`)
        setlogin({...login,number1:"",password1:""})
    }
    const signupdetails=()=>{
        setcheck({...check,check2:true})
    }
    const [sendervalue,setsendervalue]=useState(0)
    const handlemessage=()=>{
        const json1={
            usernam1:userData.username,
            message1:userData.message,
            sender1:namedata

        }
        setUserData({...userData,message:""})
        if (newSocket){
            newSocket.send( JSON.stringify(json1))
        }
    }   
  return (
    <div className='whole' >
    <div>
      {check.check1?
        <div className='container1'>
            <div className='abc'>
            <div className='left'>
                <p>{namedata}</p>
                {onlinelist.map((chat1,index)=>(
                    <div>
                        {chat1===userData.username?<div>

                            <button id="buttons" className='onlineperson'onClick={()=>{setsendervalue(index)
                        setnamedata("Group")}}>Group</button>
                        <br></br> 
                        </div>:<div>
                        <button className='onlineperson' id="buttons" onClick={()=>{setsendervalue(index)
                        setnamedata(chat1)}}>{chat1}</button>
                        </div>}
                    </div>
                ))}
            </div>
            <div className="chat-box">
                <div className="inside">
                    <h2>Chatroom  {userData.username} </h2>
                    <button className="send-button" onClick={logoutfunction}>Logout</button></div>
                    <div className="chat-content">
                        <div className="chat-messages">
                            {publicChats.map((chat,index)=>(
                                <div className='box'>
                                    {namedata!==""?
                                    <div>
                                        {chat.sender1===namedata?<div className='ins1'>
                                            <div className="avatar" key={index}>{chat.usernam1}<span>  </span></div>
                                            <div className="message-data"> {chat.message1}</div>
                                        </div>:
                                        <div>
                                            {chat.usernam1===onlinelist[sendervalue] && chat.sender1!=="Group"?<div className='ins1'>
                                                <div className="avatar" key={index}>{chat.usernam1}<span>  </span></div>
                                                <div className="message-data"> {chat.message1}</div>
                                            </div>:<div></div>}
                                        </div>}
                                    </div>:
                                    <div></div>}
                                    {/* {chat.sender1===namedata?<div className='ins1'>
                                        <div className="avatar" key={index}>{chat.usernam1}<span>  </span></div>
                                        <div className="message-data"> {chat.message1}</div>
                                    </div>:
                                    <div>
                                        {chat.usernam1===onlinelist[sendervalue] && chat.sender1!=="Group"?<div className='ins1'>
                                            <div className="avatar" key={index}>{chat.usernam1}<span>  </span></div>
                                            <div className="message-data"> {chat.message1}</div>
                                        </div>:<div></div>}
                                    </div>} */}
                                </div>
                        ))}
                        </div>
                    </div>
            </div>
            </div>
            <div className="send-message">
                <input type="text" className="input-message" id="input" placeholder="Enter the message" value={userData.message} onChange={e=>setUserData({...userData,message:e.target.value})} /> 
                <button type="button" className="send-button" onClick={handlemessage}>send</button>
            </div>
        </div>:
        <div>
            {check.check2?
                <div>
                    <div className='container'>
                        <div className='row'>
                            
                            <div className='col-md-6 offset md-3 border rounded p-4 mt-2 shadow' id='abcd'>
                            
                                <div className='mb-3'>
                                    <label htmlFor='FolderName' className='form-label'>
                                        UserName
                                    </label>
                                    <input
                                    type={"text"}
                                    className="form-control"
                                    placeholder='Enter UserName'
                                    name="FolderName"
                                    value={login.username_log}
                                    onChange={e=>setusedetails({...userdetails,username:e.target.value})}
                                    />
                                    <label htmlFor='FolderName' className='form-label'>
                                        Password
                                    </label>
                                    <input
                                    type={"password"}
                                    className="form-control"
                                    placeholder='Enter Password'
                                    name="FolderName"
                                    value={userdetails.password}
                                    onChange={e=>setusedetails({...userdetails,password:e.target.value})}
                                    />
                                    <label htmlFor='FolderName' className='form-label'>
                                        number
                                    </label>
                                    <input
                                    type={"tel"}
                                    className="form-control"
                                    placeholder='Enter Number'
                                    name="FolderName"
                                    value={userdetails.number}
                                    onChange={e=>setusedetails({...userdetails,number:e.target.value})}
                                    />
                                    <br></br>
                                    <button type="submit" className='btn btn-primary' onClick={signup}>Submit</button>
                                    
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            :
            <div>   
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6 offset md-3 border rounded p-4 mt-2 shadow' id='abcd'>
                            
                                <div className='mb-3'>
                                    <label htmlFor='FolderName' className='form-label'>
                                        Number
                                    </label>
                                    <input
                                    type={"text"}
                                    className="form-control"
                                    placeholder='Enter Number'
                                    name="FolderName"
                                    value={login.number1}
                                    onChange={e=>setlogin({...login,number1:e.target.value})}
                                    />
                                    <label htmlFor='FolderName' className='form-label'>
                                        Password
                                    </label>
                                    <input
                                    type={"password"}
                                    className="form-control"
                                    placeholder='Enter Password'
                                    name="FolderName"
                                    value={login.password1}
                                    onChange={e=>setlogin({...login,password1:e.target.value})}
                                    />
                                    <br></br>
                                    <button type="submit" className='btn btn-primary' onClick={autherfication}>Submit</button>
                                    
                                    <button type="submit" id='buttonid' className='btn btn-primary' onClick={signupdetails}>Sign up</button>
                                </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
      }
    </div>
    </div>
  )
}
