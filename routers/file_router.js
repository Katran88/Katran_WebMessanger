const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { root_folder, static_files_folder, avatars_folder } = require('../config');
const file_controller = require('../controllers/file_controller');
const JwtHelper = require('../helpers/jwtHelper');
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const Chat = require('../models/Chat');

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
            let avatar_name = "";
            if(req.query.chat_id != undefined)
            {
                avatar_name = req.query.chat_id + path.extname(file.originalname);
                callBack(null, avatar_name);

                await Chat.updateOne({_id: req.query.chat_id}, {chat_avatar_path: avatars_folder + '\\' + avatar_name});
            }
            else
            {
                const { id } = JwtHelper.verifyAndParseToken(req.cookies.token);
                const user = await User.findById(id);
                avatar_name = user.login + path.extname(file.originalname);
                callBack(null, avatar_name);

                await UserInfo.updateOne({user_id: id}, {chat_avatar_path: avatars_folder + '\\' + avatar_name});
            }
        }
    }
});

router.post('/', multer({storage:storageConfig}).single("fileData"), file_controller.uploadFile);

module.exports = router;