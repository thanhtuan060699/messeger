let readMore = (req,res) =>{
    try {
        let skipNumberNotif =+(req.query.skipNumber) 
        let newNotifications = await
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports={
    readMore : readMore
}