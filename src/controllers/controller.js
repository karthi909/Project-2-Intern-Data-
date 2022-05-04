const collageModel = require('../models/collageModel')
const internModel = require('../models/internModel')

const mongoose = require("mongoose")


const createCollage = async (req, res) => {
    try{
        let data = req.body
        if(Object.keys(data).length == 0) return res.status(400).send({msg:"data is Missing"})
        if(data.name.trim().length == 0) return res.status(400).send({msg:"name is Required"})
        if(data.fullName.trim().length == 0) return res.status(400).send({msg:"fullName is Required"})


        let savedData = await collageModel.create(data)
        res.status(201).send({status: true, msg:"Collage Created Successfully", data: savedData})
    }
    catch(err){
        res.status(500).send({status: false, Error: err.message})
    }
}

const createIntern = async (req, res) => {
    try{
        let data = req.body
        if(Object.keys(data).length == 0) return res.status(400).send({msg:"data is Missing"})
        if(data.name.trim().length == 0) return res.status(400).send({msg:"name is Required"})
        if(data.email.trim().length == 0) return res.status(400).send({msg:"email is Requried"})
        if(data.mobile.trim().length == 0 ) return res.status(400).send({msg:"mobile Number is Requried"})

        let collageid = req.body.collageId   
        if (collageid.trim().length == 0) return res.send({ status: false, Error: 'collage Id is missing' })
        if (!mongoose.isValidObjectId(collageid)) return res.status(404).send({ status: false, Error: "Invalid Mongoose object Id" }) 

        let collage = await collageModel.findOne({ _id: collageid }, { _id: 1 }); 
       
        if(collage == null || undefined) return res.status(400).send({msg:"not a valid Id"})


      
        let getUniqueValues = await internModel.findOne({ $or: [{ email: data.email }, { mobile: data.mobile }] });
        if (getUniqueValues) return res.status(400).send({ status: false, message: "Email or Mobile number already exist" })
        

        let savedData = await internModel.create(data)
        res.status(201).send({status: true, msg:"Intern Created Successfully", data: savedData })
    }
    catch(err){
        res.status(500).send({status: false, Error: err.message})
    }
}

const getCOllageDetails = async (req, res) => {

    try{

        let data = req.query
        if (data.length == 0) return res.status(400).send({ status: false, message: "provide the College name" })
        let findCollege = await collageModel.find({name : data.collegeName})
        if(findCollege.length==0) return res.status(404).send({status:false, message: `${data.collegeName} doesn't exist`})

        let findIntern = await internModel.find({collegeId : findCollege[0]._id}).select({_id:1, name:1, email:1, mobile:1})
        if(findIntern.length==0) return res.status(404).send({status:false, messsage: `No intern applied in ${data.collegeName}`})

        res.status(200).send({status : true, data : {name : data.collegeName,fullName : findCollege[0].fullName,logoLink: findCollege[0].logoLink,interests : findIntern}})


    }
    catch(err){
    res.status(500).send({status: false, Error: err.message})
     }
         
}


module.exports.getCOllageDetails = getCOllageDetails


module.exports.createIntern = createIntern
module.exports.createCollage = createCollage