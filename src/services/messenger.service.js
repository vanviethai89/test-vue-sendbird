import SendBird from 'sendbird';

const APP_ID = 'E80C0CC2-1675-4779-B6E7-9127A76FF732';

const sendBird = new SendBird({ appId: APP_ID });

window.sendBird = sendBird;

const Messenger = {
  connectUser(userId) {
    return new Promise((resolve, reject) => {
      sendBird.connect(userId, function (user, error) {
        if (error) {
          return reject(error);
        }

        resolve(user);
      });
    });
  },

  getListGroup() {
    return new Promise(() => {
      const channelListQuery = sendBird.GroupChannel.createMyGroupChannelListQuery();
      channelListQuery.includeEmpty = true;
      channelListQuery.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
      channelListQuery.limit = 15;    // The value of pagination limit could be set up to 100.

      if (channelListQuery.hasNext) {
        channelListQuery.next(function(channelList, error) {
          if (error) {
            return;
          }

          console.log(channelList);
        });
      }
    })
  },

};


// const ConnectionHandler = {
//   onReconnectStarted: null,
//   onReconnectSucceeded: null,
//   onReconnectFailed: null,
//   init() {
//     var connectionHandler = new sb.ConnectionHandler();
//   }
// };

// var connectionHandler = null;
// const sendBirdConnection = function () {
//   if (connectionHandler) {
//     return connectionHandler;
//   }
//
//   // connectionHandler = new sendBirdConnection();
//   // connectionHandler.onReconnectStarted = null;
//   // connectionHandler.onReconnectSucceeded = null;
//   // connectionHandler.onReconnectFailed = null;
// };
//
// ConnectionHandler.prototype.createConnectionHandler = (key) => {
//   const connectionHandler = new sendBird.ConnectionHandler();
//
//   connectionHandler.onReconnectStarted = function() {
//
//   };
//
//   connectionHandler.onReconnectSucceeded = function() {
//
//   };
//
//   connectionHandler.onReconnectFailed = function() {
//
//   };
//
//   sendBird.addConnectionHandler(key, connectionHandler);
// };

// ConnectionHandler.prototype.removeHandler = () => {
//
// };



var sendBirdConnectionInstance = null;

function SendBirdConnectionFn() {
  this.onReconnectStarted = null;
  this.onReconnectSucceeded = null;
  this.onReconnectFailed = null;

  this.key = 'connectionHandlerId';

  this.addHandler(this.key);
}

SendBirdConnectionFn.prototype.addHandler = function (key) {
  const _this = this;
  const connectionHandler = new sendBird.ConnectionHandler();

  connectionHandler.onReconnectStarted = function() {alert('Zzz');
    if (_this.onReconnectStarted) {
      _this.onReconnectStarted();
    }
  };

  connectionHandler.onReconnectSucceeded = function () {alert('Zzz');
    if (_this.onReconnectSucceeded) {
      _this.onReconnectSucceeded();
    }
  };

  connectionHandler.onReconnectFailed = function () {alert('Zzz');
    if (_this.onReconnectFailed) {
      _this.onReconnectFailed();
    }
  };

  sendBird.addConnectionHandler(key, connectionHandler);
};

SendBirdConnectionFn.prototype.removeHandler = function () {
  sendBird.removeConnectionHandler(this.key);
};

var sendBirdConnection = function () {
  if (!sendBirdConnectionInstance) {
    sendBirdConnectionInstance = new SendBirdConnectionFn();
  }

  return sendBirdConnectionInstance;
};

export {sendBird, sendBirdConnection};

export default Messenger;
