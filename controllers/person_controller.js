const Person=require('../models/person');
const MainHelper=require('../helpers/main_helper');


class PersonController{
    
    static async create(req,res){

        let personData=req.body;

        try{

            let response = await Person.create(personData);
			if (response) {
				return MainHelper.response200(res, 'Person Added', response.toObject());
			} else {
				return MainHelper.response404(res);
			}
        } catch (e) {
			console.log(e);
			return MainHelper.response500(res);
		}

    }

    static async list(req,res){
         
        try {
			let response = await Person.find().sort({ createdAt: -1 });
			let personList = response.map((person) => {
				return person.toObject();
			});
			return MainHelper.response200(res, 'Person List', personList);
		} catch (error) {
			console.log(error);
			return MainHelper.response500(res);
		}
    }

    static async get(req,res){
       
        try {
            let personId = req.params.id;
            let person = await Activity.findById(personId);
            return MainHelper.response200(res, 'Person ', person.toObject());
        } catch (error) {
            console.log(error);
            return MainHelper.response500(res);
        }
    }
}

module.exports=PersonController;