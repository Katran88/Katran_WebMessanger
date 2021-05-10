class admin_controller
{
    async renderAccessManagementPage(req, res)
    {
       res.render('accessManagementPage',
       {
           title: 'Access Management'
       });
    }
}

module.exports = new admin_controller();