
module.exports = app => {

    app.get("/", (req, res) => {
        res.status(200).json({ message: "Welcome to my Express Api!" })
    })

    // app.get("/base64", (req, res) => {
    //     const crypto = require('crypto')
    //     const key = crypto.randomBytes(256).toString('base64')        
    //     res.status(200).json({ message: key })
    // })
}    