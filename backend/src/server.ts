import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Settings data (in-memory database)
let settings = {
  user: {
    notifications: true,
    darkMode: false,
    fontSize: 16,
    language: 'en',
    autoSync: true
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    soundEnabled: true
  },
  privacy: {
    profileVisibility: 'public',
    showReadingHistory: true,
    showBookmarks: true,
    showReviews: false
  }
};

// User Settings Endpoints
app.get('/settings/user', (req, res) => {
  res.json(settings.user);
});

app.put('/settings/user', (req, res) => {
  settings.user = { ...settings.user, ...req.body };
  res.json(settings.user);
});

// Notification Settings Endpoints
app.get('/settings/notifications', (req, res) => {
  res.json(settings.notifications);
});

app.put('/settings/notifications', (req, res) => {
  settings.notifications = { ...settings.notifications, ...req.body };
  res.json(settings.notifications);
});

// Privacy Settings Endpoints
app.get('/settings/privacy', (req, res) => {
  res.json(settings.privacy);
});

app.put('/settings/privacy', (req, res) => {
  settings.privacy = { ...settings.privacy, ...req.body };
  res.json(settings.privacy);
});

// Reset Settings Endpoint
app.post('/settings/reset', (req, res) => {
  settings = {
    user: {
      notifications: true,
      darkMode: false,
      fontSize: 16,
      language: 'en',
      autoSync: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      soundEnabled: true
    },
    privacy: {
      profileVisibility: 'public',
      showReadingHistory: true,
      showBookmarks: true,
      showReviews: false
    }
  };
  res.json({ message: 'Settings reset to default' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 