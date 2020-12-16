const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
    {

        userType: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        ipAddress: String,
        status: Boolean,
        remark: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("LoginLog", loginLogSchema);
