<template>
    <div>
        <ul>
            <li v-for="channel in channels">
                {{ channel.url }}
            </li>
        </ul>

<!--        <button @click="fetchMoreGroup">Fetch more group</button>-->
<!--        <button @click="fetchMoreGroup">Fetch more group</button>-->
        <p>
            <button @click="fetchMoreGroupViaSyncManager">Fetch more group via sync manager</button>
        </p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>
            <button @click="registerChannelSyncEvent">Re-Register channel event</button>
        </p>
        <p>
            <button @click="closeTheView">Close the view</button>
        </p>
        <p>
            <button @click="registerChannelCollection">registerChannelCollection</button>
        </p>

<!--        <p>-->
<!--            <button @click="removeChannelCollection">Remove channel collection</button>-->
<!--        </p>-->
<!--        <p>-->
<!--            <button @click="pauseSync">Pause sync</button>-->
<!--        </p>-->
<!--        <p>-->
<!--            <button @click="resumeSync">Resume sync</button>-->
<!--        </p>-->
    </div>
</template>

<script>
  import { sendBird, SendBirdSyncManager, getChannelCollection, SendBird } from '../services/messenger.service';

export default {
  name: 'SyncManager2',
  data() {
    return {
      uId: 'vanviethai',
      sId: 'quarium-store',
      connectionHandler: null,
      channelCollection: null,
      originChannels: [],
      listQuery: null,
      sb: null
    };
  },
  computed: {
    channels() {
      return this.originChannels.map((channel) => {
        return channel;
      });
    }
  },
  mounted() {
    const _this = this;

    sendBird.connect(_this.uId).then(function (user, error) {
      if (error) {
        console.log('error: ', error);
        return;
      }

      console.log('connection establishment to user: ', user);
    });

    setTimeout(function () {
      sendBird.connect(_this.uId).then(function (user, error) {
        if (error) {
          console.log('error: ', error);
          return;
        }

        console.log('connection establishment to user: ', user);
      });
    }, 5000);

    setTimeout(function () {
      sendBird.connect(_this.uId).then(function (user, error) {
        if (error) {
          console.log('error: ', error);
          return;
        }

        console.log('connection establishment to user: ', user);
      });
    }, 10000);

    setTimeout(function () {
      sendBird.connect(_this.sId).then(function (user, error) {
        if (error) {
          console.log('error: ', error);
          return;
        }

        console.log('connection establishment to user: ', user);
      });
    }, 15000);

    return;

    const options = new SendBirdSyncManager.Options();
    options.messageCollectionCapacity = 2000;
    options.messageResendPolicy = 'automatic';
    options.automaticMessageResendRetryCount = 5;
    options.maxFailedMessageCountPerChannel = 50;
    options.failedMessageRetentionDays = 7;

    SendBirdSyncManager.setup(_this.uId, options, () => {
      _this.registerChannelCollection();

      // @todo: Moi 5s, cap nhat lastMessageTime
      // chatLeft.loadGroupChannelList(true);

      sendBird.connect(
        _this.uId
      )
        .then(user => {
          console.log('Connection is established');

          _this.channelCollection.fetch(() => {
            // @todo: set default channel group
            console.log('Set default channel group');
          });

          // ----------------------------------------------------------------
          // Setup connection handler
          const manager = SendBirdSyncManager.getInstance();
          const handler = new sendBird.ConnectionHandler();

          handler.onReconnectStarted = () => {
            console.log('onReconnectStarted ...');
          };

          handler.onReconnectSucceeded = () => {
            console.log('onReconnectSucceeded ...');
            console.log('resume sync ...');
            manager.resumeSync();
          };

          handler.onReconnectFailed = () => {
            console.log('onReconnectFailed ...');
            console.log('trying reconnect ...');
            sendBird.reconnect();
          };

          sendBird.addConnectionHandler('ConnectionHandler', handler);

          console.log('handler: ', handler);
        })
        .catch(() => {
          console.log('Connection is not established.');
          // Toast.start(document.body, 'Connection is not established.');
        });
    });
  },
  methods: {
    fetchMoreGroupViaSyncManager() {
        this.channelCollection.fetch(() => {
            console.log('Fetch success');
        });
    },
    removeChannelCollection() {
      if (this.channelCollection) {
        this.channelCollection.remove();
      }
    },
    // clearCache() {
    //   SendBirdSyncManager.getInstance().clearCache();
    // },
    pauseSync() {
      SendBirdSyncManager.getInstance().pauseSync();
      console.log('Pause sync');
    },
    resumeSync() {
      SendBirdSyncManager.getInstance().resumeSync();
      console.log('Resume sync');
    },
    registerChannelCollection() {
      const _this = this;

      const query = sendBird.GroupChannel.createMyGroupChannelListQuery();
      query.limit = 2;
      query.includeEmpty = true;
      query.order = 'latest_last_message';

      const channelCollection = new SendBirdSyncManager.ChannelCollection(query);

      _this.channelCollection = channelCollection;
      window.channelCollection = channelCollection;

      const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
      collectionHandler.onChannelEvent = (action, channels) => {
        console.log('Fireaction: ', action, 'Number: ', channels.length, 'channels: ', channels);
        _this.originChannels = _this.channelCollection.channels;
      };

      _this.channelCollection.setCollectionHandler(collectionHandler);

      _this.channelCollection.fetch();
    },
    registerChannelSyncEvent() {
      const _this = this;

      const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
      collectionHandler.onChannelEvent = (action, channels) => {
        console.log('New action - Fireaction: ', action, 'Number: ', channels.length, 'channels: ', channels);
        _this.originChannels = _this.channelCollection.channels;
      };

      _this.channelCollection.setCollectionHandler(collectionHandler);

    },
    closeTheView() {
        this.channelCollection.remove();
    },
    fetchMoreGroup() {
      this.listQuery = sendBird.GroupChannel.createMyGroupChannelListQuery();
      this.listQuery.includeEmpty = true;
      // listQuery.memberStateFilter = 'joined_only';    // 'all', 'joined_only', 'invited_only', 'invited_by_friend', and 'invited_by_non_friend'
      this.listQuery.order = 'latest_last_message';    // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
      this.listQuery.limit = 1;   // The value of pagination limit could be set up to 100.

      if (this.listQuery.hasNext) {
        console.log('hasNext');

        this.listQuery.next(function(groupChannels, error) {
          if (error) {
            console.log('error: ', error);
            return;
          }

          const ids  =[];
          groupChannels.forEach((groupChannel) => {
            ids.push(groupChannel.url);
          });

          console.log('get List ids: ', ids.join(', '));
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
