window.zafClient = {
  get: function(path) {
    return new Promise(function(resolve) {
      if (path === 'colorScheme') {
        resolve({ colorScheme: 'light' });
      }
    });
  },
  set: function(path, value) {
    return new Promise(function(resolve) {
      resolve('x');
    });
  },
  request: function(options) {
    return new Promise(function(resolve) {
      if (options.url === '/api/v2/search.json') {
        resolve({
          results: [
            {
              id: 12345,
              subject: 'Login issues with mobile app',
              status: 'open',
              priority: 'high',
              ticket_type: 'problem'
            },
            {
              id: 12346,
              subject: 'Payment gateway timeout errors',
              status: 'pending',
              priority: 'urgent',
              ticket_type: 'problem'
            },
            {
              id: 12347,
              subject: 'Dashboard not loading for users',
              status: 'solved',
              priority: 'normal',
              ticket_type: 'problem'
            }
          ]
        });
      }
    });
  },
  invoke: function(action, arg1, arg2) {
    return new Promise(function(resolve) {
      resolve('x');
    });
  },
  on: function(event, callback) {
    return;
  }
};
