const Notification = require('../models/notificationModel');
const User = require('../models/usersModel');

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        let query = { recipient: userId };
        if (unreadOnly === 'true') {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate('sender', 'firstName lastName email')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments({ recipient: userId });
        const unreadCount = await Notification.countDocuments({ 
            recipient: userId, 
            read: false 
        });

        // Transform notifications to match frontend expectations
        const transformedNotifications = notifications.map(notification => ({
            _id: notification._id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            isRead: notification.read, // Transform 'read' to 'isRead'
            createdAt: notification.createdAt,
            project: notification.project,
            client: notification.sender // Use sender as client info
        }));

        res.status(200).json({
            success: true,
            data: transformedNotifications, // Return as 'data' to match frontend
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            unreadCount
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notifications as read',
            error: error.message
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

module.exports = {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};