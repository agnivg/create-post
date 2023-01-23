import axios from 'axios';
import React,{useState,useEffect} from 'react';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import './App.css'

const App=()=>{
    const [data,setData]=useState({
        user:"",
        desc:"",
    })
    const [post,setPost]=useState([]);
    const [fileName,setFileName]=useState("");
    const [file,setFile]=useState("");
    const [ip,setIp]=useState("");
    const [inputkey,setInputkey]=useState(Date.now());
    useEffect(()=>{
        if(fileName){
            const d={
            user:data.user,
            desc:data.desc,
            fname:fileName,
            ip:ip
        }
        axios.post('https://create-post.onrender.com/api/submit/data',d).then(()=>{
            setData({
                user:"",
                desc:""
            }); 
            setFileName("");  
            setFile("");
            setInputkey(Date.now());
            console.log("Data submitted");
            getPosts();
        }).catch(()=>{
            console.log("Internal Server error");
        })
        }
    },[fileName])
    const change=(e)=>{
        const name=e.target.name;
        const val=e.target.value;
        setData({
            ...data,
            [name]:val
        })
    }
    const getip=async()=>{
        const d=await fetch('https://api.ipify.org?format=json')
        const dat=await d.json();
        setIp(dat.ip);
    }
    const submit=async (e)=>{
        e.preventDefault(); 
        const files = Array.from(file)
            files.map(async file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const form = new FormData();
                    form.append("image", file)
                    const response = await fetch("https://api.imgbb.com/1/upload?key=b25be8be2dd8588068d161a073d36cdd", {
                        body: form,
                        method: "POST"
                    })
                    const data = await response.json()
                    setFileName(data.data.display_url);
                };
                reader.onerror = error => alert(error);
            })            
    }
    function drop(e){
         setFile(e.target.files)          
    }
    const likepost=(e,id)=>{
            e.preventDefault()
            axios({
                url:'https://create-post.onrender.com/api/like',
                method:'POST',
                data: {id:id,ip:ip}
            }).then((res)=>{
                if(!res.data.success)
                    alert(res.data.message);
                getPosts();
            }).catch((e)=>{
                console.log("Internal Server error");
            })
    }
    const dislikepost=(e,id)=>{
            e.preventDefault()
            axios({
                url:'https://create-post.onrender.com/api/dislike',
                method:'POST',
                data: {id:id,ip:ip}
            }).then((res)=>{
                if(!res.data.success)
                    alert(res.data.message);
                getPosts();
            }).catch((e)=>{
                console.log("Internal Server error");
            })
    }
    const deletepost=(e,id)=>{
        e.preventDefault()
        var a=prompt("Are you sure you want to delete the post? Write yes to confirm....");
        if(a===null)
            a="";
        a=a.toLowerCase();
        if(a==="yes"){
            axios({
                url:'https://create-post.onrender.com/api/delete',
                method:'POST',
                data: {id:id,ip:ip}
            }).then((res)=>{
                if(res.data.success)
                    console.log("Deleted Successfully");
                else
                    alert(res.data.message);
                getPosts();
            }).catch(()=>{
                console.log("Internal Server error");
            })
        }       
    }
    const getPosts=async()=>{
        const res=await fetch('https://create-post.onrender.com/api/data');
        const posts=await res.json();
        setPost(posts);
    }
    useEffect(()=>{
        alert("Community Guidelines:\n1. Treat others online as you would treat them in real life\n2. Be tolerant towards other’s viewpoints; respectfully disagree when opinions do not align\n3. Respect the privacy and personal information of others\n4. Communicate with courtesy and respect\n\nPlease do not:\n1. Make personal attacks on other community members\n2. Use defamatory remarks or make false statements against others\n3. Post prejudiced comments or profanity\n4. Bully or make inflammatory remarks to other community members\n\nConsequences:\nWe will take action when we see someone violating these guidelines. Sometimes that just means giving someone a warning; other times it means revoking certain privileges or accounts entirely. We request that all community members report behavior that violates our guidelines to agnivg157@gmail.com.\n\nAgreement:\nBy logging onto the community and activating your profile, you are considered to be in agreement with the terms and conditions listed above.")
        getPosts();
        getip();
    },[])
    const displayPosts=(posts)=>{
        if(!posts.length){
            return null;
        }else{
            return(
                <>
                <h2>All Posts</h2>
                {
                    posts.map((post,index)=>{
                        if(post.image===""){
                            if(post.ip===ip){
                                return(
                                <div key={index} className="post-body">
                                    <h4>Created by <span style={{color:"red"}}>{post.name} </span><p className="createdAt"> {post.createdAt}</p></h4>
                                    <p style={{color:"brown",fontSize:"1.2rem",fontWeight:"bold"}}>{post.description}</p>                          
                                    <div className="like-dislike"><button onClick={(e)=>likepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-up"></i></button> {post.like} <button onClick={(e)=>dislikepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-down"></i></button> {post.dislike}<button onClick={(e)=>deletepost(e,post._id)} className="delete">Delete Post</button></div>
                                </div>
                                )                             
                            }
                            else{
                                return(
                                <div key={index} className="post-body">
                                    <h4>Created by <span style={{color:"red"}}>{post.name} </span><p className="createdAt"> {post.createdAt}</p></h4>
                                    <p style={{color:"brown",fontSize:"1.2rem",fontWeight:"bold"}}>{post.description}</p>                          
                                    <div className="like-dislike"><button onClick={(e)=>likepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-up"></i></button> {post.like} <button onClick={(e)=>dislikepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-down"></i></button> {post.dislike}</div>
                                </div>
                                )                              
                            }
                        }
                        else{
                            if(post.ip===ip){
                                return(
                                <div key={index} className="post-body">
                                    <h4>Created by <span style={{color:"red"}}>{post.name} </span><p className="createdAt"> {post.createdAt}</p></h4>
                                    <p style={{color:"brown",fontSize:"1.2rem",fontWeight:"bold"}}>{post.description}</p>
                                    <a href={post.image} target="_blank" rel="noreferrer"><img src={post.image} className="post-image" alt=""/></a>
                                    <div className="like-dislike"><button onClick={(e)=>likepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-up"></i></button> {post.like} <button onClick={(e)=>dislikepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-down"></i></button> {post.dislike}<button onClick={(e)=>deletepost(e,post._id)} className="delete">Delete Post</button></div>
                                </div>
                                )
                            }
                            else{
                                return(
                                <div key={index} className="post-body">
                                    <h4>Created by <span style={{color:"red"}}>{post.name} </span><p className="createdAt"> {post.createdAt}</p></h4>
                                    <p style={{color:"brown",fontSize:"1.2rem",fontWeight:"bold"}}>{post.description}</p>
                                    <a href={post.image} target="_blank" rel="noreferrer"><img src={post.image} className="post-image" alt=""/></a>
                                    <div className="like-dislike"><button onClick={(e)=>likepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-up"></i></button> {post.like} <button onClick={(e)=>dislikepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-down"></i></button> {post.dislike}</div>
                                </div>
                                )                               
                                
                            }
                        }                       
                    })
                }
                </>
            )
        }       
    }
    return(
        <>
            <div className="heading"><h1>Creating a post</h1></div>
            <div className="body">
                <form onSubmit={submit}>              
                    <div style={{textAlign:'center',color:'white',fontSize:'1.2rem'}}>Enter your name</div>
                    <input type="text" name="user" placeholder="Your name" value={data.user} className="user" onChange={change} required/>
                    <div style={{textAlign:'center',color:'white',fontSize:'1.2rem'}}>Write your post</div>
                    <textarea name="desc" rows="10" cols="50" value={data.desc} placeholder="Your post" className="desc" onChange={change} required/><br/>
                    <div style={{textAlign:'center',color:'white',fontSize:'1.2rem'}}>Upload Image(If want to)</div>
                    <input type="file" name="myImage" accept=".jpeg,.jpg,.png" placeholder="Upload image" className="image" id="myfile" onChange={drop} key={inputkey}/>
                    <button className="btn" type="submit">Create Post</button>
                </form>
            </div>
            <div className="posts">
                {displayPosts(post)}
            </div>
        </>
    )
}

export default App;
