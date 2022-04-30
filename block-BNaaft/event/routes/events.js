var express = require('express')
var Event = require('../models/Event')
var Remark = require('../models/Remark')
var router = express.Router()
var moment = require('moment')

/* GET users listing. */
//All category
var categorie
var location
//Event_Form
router.get('/new', (req, res) => {
  res.render('eventForm')
})

//Event_create
router.post('/', (req, res, next) => {
  req.body.event_category = req.body.event_category.trim().split(',')
  Event.create(req.body, (err, event) => {
    if (err) res.redirect('/events/new')
    res.redirect('/events/')
  })
})

//All_Event
router.get('/', (req, res, next) => {
  var allCategories = []
  var allLocations = []
var query = {};
if(req.query.category){
  query.event_category=req.query.category
}else if(req.query.location){
  query.location=req.query.location
}
  Event.find(query,(err, events) => {
    if (err) return next(err)

    Event.distinct('event_category', (err, elem) => {
      if (err) return next(err)
      elem.forEach((str) => allCategories.push(str))

      Event.distinct('location', (err, loc) => {
        if (err) return next(err)
        allLocations.push(loc)
        categorie = allCategories
        allLocations = allLocations.flat()
        location = allLocations
        res.render('events', {
          list: events,
          categories: allCategories,
          locations: allLocations,
        })
      })
    })
  })
})

//date
router.get('/date',(req,res,next)=>{
  var allCategories = []
  var allLocations = []
  console.log(req.query);
  Event.find({$and:[{start_date:{$gte:req.query.startDate}},{end_date:{$lte:req.query.endDate}}]},(err,events)=>{
    console.log(categorie,location)
    if(err) return err
    Event.distinct('event_category', (err, elem) => {
      if (err) return next(err)
      elem.forEach((str) => allCategories.push(str))

      Event.distinct('location', (err, loc) => {
        if (err) return next(err)
        allLocations.push(loc)
        categorie = allCategories
        allLocations = allLocations.flat()
        location = allLocations
        res.render('events', {
          list: events,
          categories: allCategories,
          locations: allLocations,
        })
      })
    })
  })
})
//single event
router.get('/:id', (req, res, next) => {
  let id = req.params.id
  Event.findById(id)
    .populate('remarks')
    .exec((err, event) => {
      if (err) return next(err);
      res.render('singleEvent', { event: event })
    })
})
//edit
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id
  Event.findById(id, (err, event) => {
    
    if (err) return next(err)
    event.end_date=moment(event.end_date).format("DD/MM/YYYY").toString();
     event.start_date=moment(event.start_date).format("DD/MM/YYYY").toString()
    console.log(event.end_date,event.start_date)
    res.render('eventUpdate', {
      event: event,
    })
  })
})

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id
  req.body.event_category = req.body.event_category.trim().split(',')
  req.body.start_date = req.body.start_date.toString().substring(0, 15)
  req.body.end_date = req.body.end_date.toString().substring(0, 15)
  Event.findByIdAndUpdate(id, req.body, (err, event) => {
    if (err) return next(err)
    res.redirect('/events/' + id)
  })
})

//delete
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id
  Event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err)
    res.redirect('/events')
  })
})

//likes
router.get('/:id/like', (req, res, next) => {
  let id = req.params.id
  Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    if (err) return next(err)
    console.log(event)
    res.redirect('/events/' + id)
  })
})
//dislikes
router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id
  Event.findById(id,(err,sinevent)=>{
    if (err) return next(err)
else if(sinevent.likes>0){
  Event.findByIdAndUpdate(sinevent._id, { $inc: { likes: -1 } }, (err, event) => {
    if(err) return next(err)
    res.redirect('/events/' + id)
  })
}
  })
  
})
router.post('/:id/remarks', async (req, res, next) => {
  let id = req.params.id
  req.body.eventId = id

  try {
    let remark = await Remark.create(req.body)
    let updatedEvent = await Event.findByIdAndUpdate(id, {
      $push: { remarks: remark._id },
    })
    res.redirect('/events/' + id)
  } catch (err) {
    return next(err)
  }
})

module.exports = router
