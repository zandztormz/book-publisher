module.exports = {
    getUser : (req, res, next) => {
        
        if(req.session.user) {
            req.user = req.session.user
            return next()
        }
        return res.status(401).send("Unauthorized")
    }
}