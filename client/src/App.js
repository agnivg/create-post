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
    const change=(e)=>{
        const name=e.target.name;
        const val=e.target.value;
        setData({
            ...data,
            [name]:val
        })
    }
    const submit=(e)=>{
        e.preventDefault();
        const d={
            user:data.user,
            desc:data.desc,
            fname:fileName
        }
        axios.post('/api/submit/data',d).then(()=>{
            setData({
                user:"",
                desc:""
            }); 
            setFileName("");  
            console.log("Data submitted");
            getPosts();
        }).catch(()=>{
            console.log("Internal Server error");
        })
    }
    async function drop(e){
            const files = Array.from(e.target.files)
            files.map(async file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const form = new FormData();
                    form.append("image", file)
                    const response = await fetch("https://api.imgbb.com/1/upload?key=f1e92523c7def8bc8c1bb40828557766", {
                        body: form,
                        method: "POST"
                    })
                    const data = await response.json()
                    setFileName(data.data.display_url);
                };
                reader.onerror = error => alert(error);
            })
           
    }
    const likepost=(e,id)=>{
        e.preventDefault()
        axios({
            url:'/api/like',
            method:'POST',
            data: {id:id}
        }).then(()=>{
            getPosts();
        }).catch((e)=>{
            console.log("Internal Server error");
        })
    }
    const dislikepost=(e,id)=>{
        e.preventDefault()
        axios({
            url:'/api/dislike',
            method:'POST',
            data: {id:id}
        }).then(()=>{
            getPosts();
        }).catch(()=>{
            console.log("Internal Server error");
        })
    }
    const deletepost=(e,id)=>{
        e.preventDefault()
        axios({
            url:'/api/delete',
            method:'POST',
            data: {id:id}
        }).then(()=>{
            console.log("Deleted Successfully");
            getPosts();
        }).catch(()=>{
            console.log("Internal Server error");
        })
    }
    const getPosts=async()=>{
        const res=await fetch('/api/data');
        const posts=await res.json();
        setPost(posts);
    }
    useEffect(()=>{
        getPosts();
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
                                <a href={post.image} target="_blank" rel="noreferrer"><img src={post.image} className="post-image" alt=""/></a>
                                <div className="like-dislike"><button onClick={(e)=>likepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-up"></i></button> {post.like} <button onClick={(e)=>dislikepost(e,post._id)} className="btnl"><i className="fa fa-thumbs-down"></i></button> {post.dislike}<button onClick={(e)=>deletepost(e,post._id)} className="delete">Delete Post</button></div>
                            </div>
                            )
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
                    <input type="file" name="myImage" accept=".jpeg,.jpg,.png" placeholder="Upload image" className="image" id="myfile" onChange={drop}/>
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