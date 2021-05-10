class mandatoryMessage_controller
{
    async renderMandatoryMessagePage(req, res)
    {

        let renderObj= { title: 'Mandatory Message' };

        if(req.query.permissionDenied != undefined)
        {
            renderObj.permissionDenied = 'You have no permission for this page. You will redirect on main page after a few seconds';
        }

        res.render('mandatoryMessagePage', renderObj);
    }
}

module.exports = new mandatoryMessage_controller();