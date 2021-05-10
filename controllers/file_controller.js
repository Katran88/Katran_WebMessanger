class fileController
{
    async uploadFile(req, res)
    {
        let fileData = req.file;

        if(fileData)
            res.status(200);
        else
            res.status(400);
    }
}

module.exports = new fileController();