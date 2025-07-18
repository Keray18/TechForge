const ROLES = {
    CLIENT: 'client',
    EMPLOYEE: 'lancer',
    ADMIN: 'admin'
};

const PERMISSIONS = {
    // Project permissions
    CREATE_PROJECT: 'create_project',
    VIEW_OWN_PROJECTS: 'view_own_projects',
    VIEW_ALL_PROJECTS: 'view_all_projects',
    ACCEPT_PROJECT: 'accept_project',
    REJECT_PROJECT: 'reject_project',
    COMPLETE_PROJECT: 'complete_project',
    DELETE_PROJECT: 'delete_project',

    // Notification permissions
    VIEW_NOTIFICATIONS: 'view_notifications',
    SEND_NOTIFICATIONS: 'send_notifications',
    DELETE_NOTIFICATIONS: 'delete_notifications',
    
}


const ROLE_PERMISSIONS = {
    [ROLES.CLIENT]: [
        PERMISSIONS.CREATE_PROJECT,
        PERMISSIONS.VIEW_OWN_PROJECTS,
        PERMISSIONS.VIEW_NOTIFICATIONS,
        PERMISSIONS.DELETE_NOTIFICATIONS
    ],
    [ROLES.ADMIN]: [
        ...Object.values(PERMISSIONS)
    ]
};

module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS
}