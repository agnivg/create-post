const express=require('express');
const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const cors=require('cors');
const e = require('express');

const app=express();
app.use(cors());
app.use(express.static('./public'));
app.use(express.json());
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({
    extended:false,
    limit:'50mb'
}));

mongoose.connect(process.env.MONGO_URI,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>console.log("Connection successful")).catch((err)=>{
    console.log(err);
})
const PostSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    like:{
        type:Number,
        default:0
    },
    dislike:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        default:""
    },
    ip:{
        type:String,
        required:true
    },
    ipArray:Array,
    createdAt:String
});
const Post=new mongoose.model("Post",PostSchema);
app.post('/api/submit/data',async(req,res)=>{   
    const time=new Date().toLocaleTimeString();
    const date=new Date().toLocaleDateString();
    let a;
    if(req.body.fname==="")
        a="";
    else   
        a=req.body.fname;
    try{
        const post=new Post({
            name:req.body.user,
            description:req.body.desc,
            createdAt:`${time} ${date}`,
            image:a,
            ip:req.body.ip
        })
        const reg=await post.save();
        res.status(200).send(reg);
    }
    catch(err){
        console.log(err);
    }       
})
app.post('/api/like',async(req,res)=>{
    try{
        const l=await Post.findById(req.body.id);
        if(l.ip!==req.body.ip){
            if(l.ipArray.indexOf(req.body.ip)===-1){
                const dat=await Post.findByIdAndUpdate(req.body.id,{like:l.like+1,$push:{ipArray:req.body.ip}},{new:true})
                return res.json({success:true})
            }
            else
                return res.json({success:false, message:"You have already reacted"})
        }   
        else
            return res.json({success:false, message:"You cannot like your own posts"})   
    }catch(err){
        return res.json({success:false, message:err})
    }
})
app.post("/api/delete",async(req,res)=>{
    try{
        const l=await Post.findById(req.body.id);
        if(l.ip===req.body.ip){
            const data=await Post.findByIdAndDelete({_id:req.body.id});
            return res.json({success:true})
        }
        else{
            return res.json({success:false, message:"Only creator of post has right to delete"})
        }
    }catch(err){
        return res.json({success:false, message:err})
    }
})
app.post('/api/dislike',async(req,res)=>{
    try{
        const l=await Post.findById(req.body.id);
        if(l.ip!==req.body.ip){
            if(l.ipArray.indexOf(req.body.ip)===-1){
                const dat=await Post.findByIdAndUpdate(req.body.id,{dislike:l.dislike+1,$push:{ipArray:req.body.ip}},{new:true})
                return res.json({success:true})
            }
            else
                return res.json({success:false, message:"You have already reacted"})
        }   
        else
            return res.json({success:false, message:"You cannot dislike your own posts"})   
    }catch(err){
        return res.json({success:false, message:err})
    }
})
app.get('/api/data',async(req,res)=>{
    try{
        const data=await Post.find({});
        res.status(200).send(data);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
    
})
const port=process.env.PORT||8000;
app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})
