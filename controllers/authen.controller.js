const UserModel = require("../models/users.model");

module.exports = {
    login : async (req, res) => {
        try {
            const user = await UserModel.findOne({ username: req.body.username }).exec();
            if(!user) {
                return response.status(400).send({ message: "The username does not exist" });
            }
            user.comparePassword(req.body.password, (error, match) => {
                if(!match) {
                    return res.status(400).send({ message: "The password is invalid" });
                }
            });

            delete user.password;
            req.session.user = user
            res.send({ message: "Login successfully" });
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message);
        }
    }
}