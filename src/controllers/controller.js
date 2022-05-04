const collageModel = require('../models/collageModel')

const mongoose = require("mongoose")


const createCollage = async (req, res) => {
    try{
        let data = req.body
        if(Object.keys(data).length == 0) return res.status(400).send({msg:"data is Missing"})
        if(data.name.trim().length == 0) return res.status(400).send({msg:"name is Required"})
        if(data.fullName.trim().length == 0) return res.status(400).send({msg:"fullName is Required"})


        let savdData = await collageModel.create(data)
        res.status(201).send({status: true, msg:"Collage Created Successfully", data: savdData})
    }
    catch{
        res.status(500).send({status: false, Error: err.message})
    }
}




module.exports.createCollage = createCollage