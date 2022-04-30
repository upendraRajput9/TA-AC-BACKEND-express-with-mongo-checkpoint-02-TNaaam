var express = require('express');
let Remark = require("../models/Remark");
let Event = require("../models/Event")
var router = express.Router();

router.get("/:id/edit",(req,res)=>{
    let id = req.params.id;
    Remark.findById(id,(err,remark)=>{
        if(err) return next(err)
res.render("remarkUpdate",{remark})
    })
})
router.post("/:id",(req,res)=>{
    let id = req.params.id;
    console.log(req.body)
    Remark.findByIdAndUpdate(id,req.body,(err,remark)=>{
        if(err) return next(err)
res.redirect("/events/"+remark.eventId)
    })
})

router.get("/:id/delete",(req,res)=>{
    let id = req.params.id;
    Remark.findByIdAndRemove(id,(err,remark)=>{
        if(err) return next(err)
        Event.findByIdAndUpdate(remark.eventId,{$pull:{remarks:remark._id}},(err,event)=>{
            res.redirect("/events/"+remark.eventId)
        })

    })
})

router.get("/:id/like",(req,res)=>{
    let id = req.params.id;
    Remark.findByIdAndUpdate(id,{$inc:{ likes: 1}},(err,remark)=>{
        if(err) return next(err)
            res.redirect("/events/"+remark.eventId)
    })
})
router.get("/:id/dislike",(req,res)=>{
    let id = req.params.id;
    Remark.findById(id,(err,sinremark)=>{
        if(err) return next(err)
if(sinremark.likes>0){
    Remark.findByIdAndUpdate(id,{$inc:{ likes: -1}},(err,remark)=>{
        if(err) return next(err)
            res.redirect("/events/"+remark.eventId)
    })
}
    })
    
})



module.exports= router