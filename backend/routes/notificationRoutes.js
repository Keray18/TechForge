const express = require('express');
const { protect, requirePermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/roles');
const {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.get('/', requirePermission(PERMISSIONS.VIEW_NOTIFICATIONS), getUserNotifications);

router.put('/:notificationId/read', requirePermission(PERMISSIONS.VIEW_NOTIFICATIONS), markNotificationAsRead);

router.put('/read-all', requirePermission(PERMISSIONS.VIEW_NOTIFICATIONS), markAllNotificationsAsRead);

router.delete('/:notificationId', requirePermission(PERMISSIONS.DELETE_NOTIFICATIONS), deleteNotification);

module.exports = router;