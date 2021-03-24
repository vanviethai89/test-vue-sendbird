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
        <p>
            <button @click="removeChannelCollection">Remove channel collection</button>
        </p>
        <p>
            <button @click="clearCache">Clear cache</button>
        </p>
        <p>
            <button @click="pauseSync">Pause sync</button>
        </p>
        <p>
            <button @click="resumeSync">Resume sync</button>
        </p>
    </div>
</template>

<script>

  import SendBird from 'sendbird';
  import SendBirdSyncManager from 'sendbird-syncmanager';
  import {sendBird, sendBirdConnection} from '../services/messenger.service';


  // var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  // var channelCollection = new SendBirdSyncManager.ChannelCollection(listQuery);
  // var channelHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();

export default {
  name: 'Messenger',
  data() {
    return {
      uId: 'van-viet-hai',
      sId: 'quarium-store',
      connectionHandler: null,
      channelCollection: null,
      originChannels: [],

      listQuery: null,
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

    SendBirdSyncManager.sendBird = sendBird;

    const options = new SendBirdSyncManager.Options();
    options.messageCollectionCapacity = 2000;
    options.messageResendPolicy = 'automatic';
    options.automaticMessageResendRetryCount = 5;
    options.maxFailedMessageCountPerChannel = 50;
    options.failedMessageRetentionDays = 7;

    SendBirdSyncManager.setup(_this.uId, options, () => {


      // const connectionHandler = new sendBird.ConnectionHandler();
      // connectionHandler.onReconnectStarted = function() {console.log('onReconnectStarted');};
      // connectionHandler.onReconnectSucceeded = function() {console.log('onReconnectSucceeded');};
      // connectionHandler.onReconnectFailed = function() {console.log('onReconnectFailed');};
      // sendBird.addConnectionHandler('CONNECTION_HANDLER_ID', connectionHandler);

      sendBird.connect(
        _this.uId
      )
        .then((user, error) => {
          if (error) {
            console.log('Connection is not established.', error);
            return;
          }

          console.log('Connection is established.');


          const query = sendBird.GroupChannel.createMyGroupChannelListQuery();
          query.limit = 1;
          query.includeEmpty = true;
          query.order = 'latest_last_message';

          var channelCollection = new SendBirdSyncManager.ChannelCollection(query);
          _this.channelCollection = channelCollection;
          window.channelCollection = channelCollection;

          const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
          collectionHandler.onChannelEvent = (action, channels) => {
            console.log('Action fire: ', action, channels.length, channels);
            _this.originChannels = _this.channelCollection.channels;
          };
          _this.channelCollection.setCollectionHandler(collectionHandler);




          // _this.channelCollection.fetch(() => {
          //
          // });

          // window.manager = SendBirdSyncManager.getInstance();
          // const connectionManager = sendBirdConnection();
          //
          // connectionManager.onReconnectSucceeded = () => {
          //   console.log('fire event onReconnectSucceeded, called: manager.resumeSync');
          //   window.manager.resumeSync();
          // };
          //
          // connectionManager.onReconnectFailed = () => {
          //   console.log('fire event onReconnectFailed, called: manager.reconnect');
          //   window.manager.reconnect();
          // };
        })
        .catch((err) => {
          console.log('Connection is not established.', err);
        });
    });
  },
  methods: {
    fetchMoreGroupViaSyncManager() {
        this.channelCollection.fetch(() => {

        });
    },
    removeChannelCollection() {
      if (this.channelCollection) {
        this.channelCollection.remove();
      }
    },
    clearCache() {
      SendBirdSyncManager.getInstance().clearCache();
    },
    pauseSync() {
      SendBirdSyncManager.getInstance().pauseSync();
      console.log('Pause sync');
    },
    resumeSync() {
      SendBirdSyncManager.getInstance().resumeSync();
      console.log('Resume sync');
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
