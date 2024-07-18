const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model')
const adminModel = require('../models/admin.model')

exports.isAuthenticatedUser =  (req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "JWT"
      ) {
    // console.log('auth')

        jwt.verify(
          req.headers.authorization.split(" ")[1],
          "jwtlock",
          function (err, verifiedToken) {
            if (err) {
                res.status(401).json({message: "Invalid JSON Token"});
            }
            userModel.findById(verifiedToken.id).then(user => {
                req.user = user;
                // console.log(user)
                next();
            }).catch(err => {
                res.status(500).json({message: err});
            })
          }
        );
      } else {
        res.status(403).json({message: "token not present"});
      }
};

exports.authorizeAdminRole = (req, res, next) => {
    const id=req.user._id;
    adminModel.find({adminUser: id}).then(user=>{
        if(!user){
            res.status(401).send({message: 'Admin access denied'});
        }
        req.user=user
        next();
    }).catch(err => {
      res.status(500).json({message: err});
  })
}