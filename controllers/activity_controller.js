const Activity=require('../models/activity');
const MainHelper=require('../helpers/main_helper');


class ActivityController{

    static async create(req,res){
          
        let activtyData=req.body;

        try{

            let response = await Activity.create(activtyData);
			if (response) {
				return MainHelper.response200(res, 'Activity Added', response.toObject());
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
			let response = await Activity.find().sort({ createdAt: -1 });
			let activityList = response.map((activity) => {
				return activity.toObject();
			});
			return MainHelper.response200(res, 'Activity List', activityList);
		} catch (error) {
			console.log(error);
			return MainHelper.response500(res);
		}

    }

    static async get(req,res){
      
        try {
            let activityId = req.params.id;
            let activity = await Activity.findById(activityId);
            return MainHelper.response200(res, 'Activity', activity.toObject());
        } catch (error) {
            console.log(error);
            return MainHelper.response500(res);
        }
    }
}

module.exports=ActivityController;