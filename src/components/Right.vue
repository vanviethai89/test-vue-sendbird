<template>
    <div @scroll="onListChannelScroll" class="scroll-block">
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li v-for="channel in channels">
                {{ channel.url }}
            </li>
            <div style="min-height: 0px;" v-if="isChannelLoading">
                loading...
            </div>
        </ul>
    </div>
</template>

<script>
  import MessengerService from '../services/messenger2.service';

  export default {
    name: 'Right',
    data() {
      return {
        channelCollection: null,
        isChannelLoading: false,
        uId: 'vanviethai',
        originalChannels: []
      }
    },
    computed: {
      channels() {
        return this.originalChannels.map((channel) => {
          return channel;
        });
      }
    },
    mounted() {
      // @todo: show loader
      // MessengerService.setupSyncManager(this.uId).then(() => {
      //
      // });

      const _this = this;

      Promise.all([MessengerService.connectToUser(this.uId), MessengerService.setupSyncManager(this.uId)]).then((values) => {
        _this.initChannelCollection();
        _this.fetch();
      });

      // Register event handler


    },
    methods: {
      initChannelCollection() {
        const _this = this;
        const SendBirdSyncManager = MessengerService.getSendBirdSyncManager();

        const collectionHandler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();
        collectionHandler.onChannelEvent = (action, channels) => {
          console.log('Fireaction: ', action, 'Number: ', channels.length, 'channels: ', channels);
          _this.originalChannels = _this.channelCollection.channels;
        };

        const sendBird = MessengerService.getSendBirdIntance();

        const query = sendBird.GroupChannel.createMyGroupChannelListQuery();
        query.includeEmpty = true;
        query.order = 'latest_last_message'; // 'chronological', 'latest_last_message', 'channel_name_alphabetical', and 'metadata_value_alphabetical'
        query.limit = 1;

        this.channelCollection = new SendBirdSyncManager.ChannelCollection(query);
        this.channelCollection.setCollectionHandler(collectionHandler);
      },
      fetch() {
        this.isChannelLoading = true;
        this.channelCollection.fetch(() => {
          this.isChannelLoading = false;
        });
      },
      onListChannelScroll(event)
      {
        if(event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight) {
          console.log('fetch more');
          this.fetch();
        }
      }
    },
    destroyed() {
      if (this.channelCollection) {
        this.channelCollection.remove();
      }
    },
  };
</script>

<style scoped>
    .scroll-block {
        width: 500px;
        height: 300px;
        overflow: scroll;
    }

    .scroll-block li {
        min-height: 150px;
        box-sizing: border-box;
        border-bottom: solid 1px #aaa;
    }
</style>
