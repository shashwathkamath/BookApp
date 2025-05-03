import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

export const settings = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path, body } = event;
  const pathParts = path.split('/').filter(Boolean);
  const resource = pathParts[1]; // 'user', 'notifications', or 'privacy'

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  };

  try {
    switch (httpMethod) {
      case 'GET':
        if (resource === 'user') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settings.user)
          };
        } else if (resource === 'notifications') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settings.notifications)
          };
        } else if (resource === 'privacy') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settings.privacy)
          };
        }
        break;

      case 'PUT':
        if (!body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Request body is required' })
          };
        }

        const updateData = JSON.parse(body);
        if (resource === 'user') {
          settings.user = { ...settings.user, ...updateData };
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settings.user)
          };
        } else if (resource === 'notifications') {
          settings.notifications = { ...settings.notifications, ...updateData };
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settings.notifications)
          };
        } else if (resource === 'privacy') {
          settings.privacy = { ...settings.privacy, ...updateData };
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(settings.privacy)
          };
        }
        break;

      case 'POST':
        if (resource === 'reset') {
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
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Settings reset to default' })
          };
        }
        break;
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 