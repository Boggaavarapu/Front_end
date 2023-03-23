import React, { useState } from 'react'
import axios from 'axios'
import { sha512 } from 'js-sha512';
let newSocket=null;
let  onmessage=false
export default function Whatsup() {
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
    if(onmessage){
        const data1 ={
            usernam1: 'harsfree',
            message1: 'hi automating testing',
            sender1: 'karthick'
          };
        console.log("saying",data1)
        publicChats.push(data1);
        setPublicChats([...publicChats]); 
        onmessage=false
    }
    const signup=async()=>{
        console.log("checking sign up", check.check2)
        if( containsSpecialChars(userdetails.password) ){        
            const formData = new FormData();
            formData.append("file1",image)
            const result=await axios.post(`http://localhost:8081/web/postprofile/${userdetails.username}/${sha512.hmac('1',userdetails.password )}/${userdetails.number}`,formData,{
                headers:{'Content-Type':'multipart/form-data'}
            })
            console.log(result.data)
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
    }

    const autherfication=async()=>{
        var result= await axios.get(`http://localhost:8081/web/putprofile/${login.number1}/${sha512.hmac('1', login.password1)}`)
        console.log("first",result)
        var result1= await axios.get(`http://localhost:8081/web/getsprofiles/${login.number1}/${sha512.hmac('1', login.password1)}`)
        console.log("second",result1)
        var unique=await axios.get(`http://localhost:8081/web/unique/${result1.data}`) 
        console.log("third",unique)
        console.log("data of result1",result1.data)
        setUserData({...userData,username:result1.data})
        if (result.data)
        {
            setInterval(async()=>{
                var result2=await axios.get(`http://localhost:8081/web/onlinesprofile`)
                setonlinelist(result2.data)
                console.log("seting online list",onlinelist)
                } ,100)
            setcheck({...check,check1:true})
            const newSocket1 = new WebSocket('ws://localhost:8081/chat');
            newSocket1.onopen = (event) => 
            {
                newSocket1.send(JSON.stringify({usernam1:result1.data,message:"identity",uniquecode:unique.data,sender1:"server"}))
            };
            newSocket=newSocket1
            onmessage=true
            newSocket.onmessage = (event) => 
            {
                const data1 = JSON.parse(event.data);
                console.log("saying",data1)
                publicChats.push(data1);
                setPublicChats([...publicChats]);
            };
        }
        else{
            alert('incorrect credentials')
        }
            
            
    }
    // console.log("hello",newSocket)
    // newSocket.onmessage = (event) => 
    //         {
    //             const data1 = JSON.parse(event.data);
    //             console.log(data1)
    //             publicChats.push(data1);
    //             setPublicChats([...publicChats]); 
    //         };
    const logoutfunction=async()=>{
        newSocket.close();
        setcheck({...check,check1:false})
        await axios.put(`http://localhost:8081/web/put/${login.number1}/${sha512.hmac('1', login.password1)}`)
        setlogin({...login,number1:"",password1:""})
        var arraylis=[]
        setPublicChats(arraylis)
        setnamedata("")
    }
    const signupdetails=()=>{
        console.log("checking sign up", check.check2)
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
            console.log(newSocket)
            console.log(json1)
            newSocket.send( JSON.stringify(json1))
        }
    }   
    const[image,setimage]=useState();
    function handlefile(e){
        setimage(e.target.files[0]);
      } 
      
  return (
    <div className='whole' >
    <div>
      {check.check1?
        <div className='container1'>
            <div className='abc'>
            <div className='left'>
                <p data-testid='personname'>{namedata}</p>
                 {onlinelist.map((chat1,index)=>(
                    <div>
                        {chat1.username===userData.username?<div>
                            <img className="imagesize" src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg" alt='outpt'/>
                            <button data-testid={`testid-${index}`} id="buttons" className='onlineperson'onClick={()=>{setsendervalue(index)
                        setnamedata("Group")}}>Group</button>
                        </div>:<div>
                        <img className="imagesize"src={`data:image/png;base64,${chat1.image}`} alt="Output"/>
                        <button data-testid={`testid-${index}`} className='onlineperson' id="buttons" onClick={()=>{setsendervalue(index)
                        setnamedata(chat1.username)}}>{chat1.username}</button>
                        </div>}
                    </div>
                ))} 
            </div>
            <div className="chat-box">
                <div className="inside">
                    <h3 data-testid="paragraph">Chatroom {userData.username}</h3>
                    <button data-testid="logout" className="send-button" onClick={logoutfunction}>Logout</button>
                </div>
                <div>
                    
                    {namedata===""?<div></div>:
                        <div data-testid="clickperson"className='onlinestatus'><div className='onlinestatus1'>{namedata}</div><br></br>
                        {onlinelist[sendervalue].login?<div><small>*</small></div>:<div></div>}
                        </div>
                    }
                </div>
                <div className="chat-content">
                    <div className="chat-messages">
                        {publicChats.map((chat,index)=>(
                            <div className='box'>
                                {namedata!==""?
                                    <div>
                                        {chat.sender1==="Group" && namedata==="Group"?<div className='ins1'>
                                            <div className="avatar" data-testid="chatmessagesname"key={index}>{chat.usernam1}<span>  </span></div>
                                            <div className="message-data" data-testid="chatmessages"> {chat.message1}</div>
                                        </div>:<div>
                                            {chat.sender1===namedata?<div className='ins1'>
                                                <div className="avatar" data-testid="chatmessagesname" key={index}>{chat.usernam1}<span>  </span></div>
                                                <div className="message-data"data-testid="chatmessages"> {chat.message1}</div>
                                            </div>:<div>
                                                {chat.usernam1===namedata && chat.sender1!=="Group"?<div className='ins1'>
                                                    <div className="avatar" key={index}data-testid="chatmessagesname">{chat.usernam1}<span>  </span></div>
                                                    <div className="message-data" data-testid="chatmessages"> {chat.message1}</div>

                                                </div>:<div></div>}
                                                </div>}
                                            </div>}
                                    </div>:
                                <div></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
            <div className="send-message">
                <input type="text" className="input-message" id="input" placeholder="Enter the message" value={userData.message} onChange={e=>setUserData({...userData,message:e.target.value})} /> 
                <button type="button" data-testId="sendbutton" className="send-button" onClick={handlemessage}>send</button>
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
                                    type={"text"}
                                    className="form-control"
                                    placeholder='Enter Number'
                                    name="FolderName"
                                    value={userdetails.number}
                                    onChange={e=>setusedetails({...userdetails,number:e.target.value})}
                                    />
                                    <input
                                        type={"file"}
                                        className="form-control"
                                        data-testid="testing"
                                        name="NewFolderName"
                                        onChange={handlefile}
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
                                    data-testid="number"
                                    value={login.number1}
                                    onChange={e=>setlogin({...login,number1:e.target.value})}
                                    />
                                    <label htmlFor='FolderName' className='form-label'>
                                        Password
                                    </label>
                                    <input
                                    type={"password"}
                                    id="id_password"
                                    className="form-control"
                                    placeholder='Enter Password'
                                    name="FolderName"
                                    data-testid="password"
                                    value={login.password1}
                                    onChange={e=>setlogin({...login,password1:e.target.value})}
                                    />
                                    <br></br>
                                    <button type="submit" data-testid="submit"placeholder='Submit' className='btn btn-primary' onClick={autherfication}>Submit</button>
                                    <button type="submit"  data-testid="signup"id='buttonid' placeholder='Sign up' className='btn btn-primary' onClick={signupdetails}>Sign up</button>
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
