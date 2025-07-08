-- Insert sample users
INSERT INTO users (first_name, last_name, email, password_hash, role, company, phone) VALUES
('John', 'Doe', 'john@example.com', '$2b$10$hashedpassword1', 'client', 'Acme Corp', '+1234567890'),
('Jane', 'Wilson', 'jane@example.com', '$2b$10$hashedpassword2', 'client', 'Tech Solutions', '+1234567891'),
('Mike', 'Brown', 'mike@example.com', '$2b$10$hashedpassword3', 'client', 'StartupXYZ', '+1234567892'),
('Alice', 'Smith', 'alice@company.com', '$2b$10$hashedpassword4', 'employee', 'DevPortal', '+1234567893'),
('Bob', 'Johnson', 'bob@company.com', '$2b$10$hashedpassword5', 'employee', 'DevPortal', '+1234567894'),
('Carol', 'Davis', 'carol@company.com', '$2b$10$hashedpassword6', 'employee', 'DevPortal', '+1234567895'),
('Admin', 'User', 'admin@company.com', '$2b$10$hashedpassword7', 'admin', 'DevPortal', '+1234567896');

-- Insert sample requests
INSERT INTO requests (title, description, category, budget_range, timeline, priority, status, client_id, assigned_to) VALUES
('E-commerce Website', 'Need a full e-commerce website with payment integration, inventory management, and user accounts. Should support multiple payment methods and have a modern, responsive design.', 'web-development', '5k-10k', '2-months', 'high', 'pending', 1, 4),
('Mobile App Development', 'React Native app for iOS and Android with user authentication, push notifications, and offline capabilities. The app should sync data when online.', 'mobile-app', '10k-25k', '3-months', 'medium', 'completed', 2, 5),
('Website Redesign', 'Modernize existing company website with new branding, improved UX, and mobile responsiveness. Need to maintain SEO rankings.', 'web-development', '1k-5k', '1-month', 'low', 'rejected', 3, 6),
('Portfolio Website', 'Personal portfolio website for a photographer with gallery, contact form, and blog functionality. Should showcase work beautifully.', 'web-development', '1k-5k', '2-weeks', 'medium', 'pending', 1, 4),
('API Development', 'RESTful API for mobile app backend with user management, data synchronization, and third-party integrations.', 'api-development', '5k-10k', '1-month', 'high', 'pending', 2, 5);

-- Insert sample comments
INSERT INTO request_comments (request_id, user_id, comment) VALUES
(1, 1, 'I would like to add a wishlist feature as well. Is that possible within the current budget?'),
(1, 4, 'Yes, we can definitely include a wishlist feature. I will update the project scope accordingly.'),
(2, 2, 'The app looks great! Can we add a dark mode option?'),
(2, 5, 'Dark mode has been implemented and will be included in the final release.'),
(3, 6, 'Unfortunately, the timeline is too tight for the scope of work required. We would need at least 6 weeks to deliver quality results.');
