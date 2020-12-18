const mongoose=require('mongoose');

const personSchema=new mongoose.Schema(
    {
        name:String,
        relation:String,
   },
   {
       timestamps:true,
       toObject: {
        transform: (obj, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
   }
);

module.exports=mongoose.model('Person',personSchema);