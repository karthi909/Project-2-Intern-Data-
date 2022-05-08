const collageModel = require('../models/collageModel')
const internModel = require('../models/internModel')

const mongoose = require("mongoose")


const createCollage = async (req, res) => {
    try{
        let data = req.body 
        if(Object.keys(data).length == 0) return res.status(400).send({status: false, msg:"data is Missing"})

        if(!data.name) return res.status(400).send({status: false, msg:"name feild is Required"})
        if(data.name.trim().length == 0) return res.status(400).send({status:false, msg:"name is Required"}) 
        
        if(!data.fullName) return res.status(400).send({status:false, msg:"fullName is Required"})
       if(data.fullName.trim().length == 0) return res.status(400).send({status: false, msg:"fullName is Required"})
       

        
        if(!data.logolink) return res.status(400).send({status: false, msg:"Logolink is Required"})
        if(data.logolink.trim().length == 0) return res.status(400).send({status: false, msg:'LogoLink is Required'})

        let getUniqueValues = await collageModel.findOne({name: data.name  });
        if (getUniqueValues) return res.status(400).send({ status: false, message: `${data.name} already exist` })


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

        let collegeName = data.collegeName

        if(Object.keys(data).length == 0) return res.status(400).send({status: false,msg:"data is Missing"})

        let iscollegeName = await collageModel.findOne({ name: collegeName });
        //console.log(iscollegeName) if not gives --null--
        if(!iscollegeName) return res.send({status: false, msg:`There is no college with this name ${collegeName}`})
      
        data.collegeId = iscollegeName._id;

        delete data.collegeName
      



        if(!data.name) return res.status(400).send({status:false, msg:"name is Requried"})
        if(data.name.trim().length == 0) return res.status(400).send({status: false, msg:"name is Required"})
        

        if(!data.email) return res.status(400).send({status: false, msg:"email is Requried"})
        if(!data.mobile) return res.status(400).send({status: false, msg:"mobile Number is Requried"})


        let validNumber = function() {
            var res = /^(\+\d{1,3}[- ]?)?\d{10}$/ ; 
            return res.test(data.mobile) 
        };
        if(!validNumber()) return res.status(400).send({status: false, msg:`given ${data.mobile} Not a valid Mobile Number`})

        let validEmail = function() {
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(data.email)
        };
        if(!validEmail()) return res.status(400).send({status: false, msg:`given ${data.email} Not a valid Email address`})
      

        let getUniqueValues = await internModel.findOne({ mobile: data.mobile });
        if (getUniqueValues) return res.status(400).send({ status: false, message: `Mobile_number- ${data.mobile} already existing in the data` })

        let getUniqueEmail = await internModel.findOne({email: data.email});
        if(getUniqueEmail) return res.status(400).send({status: false, msg: `email- "${data.email}" already existing in data `})

        
        
        let savedData = await internModel.create(data)
        res.status(201).send({status: true, msg:"Intern Created Successfully", data: savedData})
    }
    catch(err){
        res.status(500).send({status: false, Error: err.message})
    }
}

const getCOllageDetails = async (req, res) => {

    try{

        let data = req.query
       
        
        if(Object.keys(data) == 0) return res.status(400).send({ status: false, message: "provide the College name" })
        let findCollege = await collageModel.find({name : data.collegeName, isDeleted: false})
        

        if(findCollege.length==0) return res.status(404).send({status:false, message: ` collageName ${data.collegeName} doesn't exist`})
        

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