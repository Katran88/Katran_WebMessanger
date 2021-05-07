const avatars_folder = __dirname + '\\static\\avatars';

module.exports =
{
    port: 8000,
    token_secret:  'e912cd7942a0fdb2',
    password_salt: 8,
    database:
    {
        DB_USERNAME:    'db_user',
        DB_PASSWORD:    'Stalker2',
        CLUSTER:        'webkatran',
        DATABASE:       'webkatran_db'
    },

    avatars_folder:      avatars_folder,
    chat_files_folder:   __dirname + '\\static\\chat_files',
    default_avatar_path: avatars_folder + '\\defaultAvatar.png',

    db_defaults:
    {
        role:
        {
           user: 0,
           admin: 1
        },
        status:
        {
            offline: 0,
            online: 1
        },
        chat_kind:
        {
            chat: 0,
            conversation: 1
        },
        message_kind:
        {
            text: 0,
            file: 1
        }
    }
}