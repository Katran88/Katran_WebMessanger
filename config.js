const static_files_folder = '\\static';
const avatars_folder = '\\avatars';

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

    root_folder: __dirname,
    static_files_folder: static_files_folder,
    avatars_folder:      avatars_folder,
    default_avatar_path: avatars_folder + '\\defaultAvatar.png',
    chat_files_folder:   '\\chat_files',

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
        },
        message_status:
        {
            sent: 0,
            unread: 1,
            read: 2
        }
    }
}