class fileController
{
    async uploadFile(req, res, next)
    {
        let fileData = req.file;

        if(fileData)
            res.redirect('/');
        else
            res.redirect('/');
    }
}

module.exports = new fileController();