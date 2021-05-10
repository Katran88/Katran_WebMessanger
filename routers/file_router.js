const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { root_folder, static_files_folder, avatars_folder } = require('../config');
const file_controller = require('../controllers/file_controller');
const JwtHelper = require('../helpers/jwtHelper');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');

const storageConfig = multer.diskStorage({
    destination: (req, file, callBack) =>
    {
        if(file)
        {
            callBack(null, root_folder + static_files_folder + avatars_folder);
        }
    },
    filename: async (req, file, callBack) =>
    {
        if(file)
        {
            const { id } = JwtHelper.verifyAndParseToken(req.cookies.token);
            const user = await User.findById(id);
            const avatar_name = user.login + path.extname(file.originalname);
            callBack(null, avatar_name);

            await UserInfo.updateOne({user_id: id}, {path_to_avatar: avatars_folder + '\\' + avatar_name});
        }

    }
});

router.post('/', multer({storage:storageConfig}).single("fileData"), file_controller.uploadFile);

module.exports = router;