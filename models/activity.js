const mongoose=require('mongoose');


const activitySchema=new mongoose.Schema(
    {

        name:String,
        words:[
            {
                type:String,
            }
        ]
    },
    {
        timestamps: true,
        toObject: {
            transform: (obj, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    },
);

module.exports=mongoose.model('Activity',activitySchema);