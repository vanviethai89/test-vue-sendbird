<template>
    <div>
        <div>

        </div>
        <div>
            <ul>
                <li v-for="message in messages">
                    message text
                </li>
            </ul>
            <input type="text" v-model="chatText">
            <button @click="send">Send</button>
        </div>
    </div>
</template>

<script>
  import MessengerService from '../services/messenger2.service';

  export default {
    name: 'Left',
    props: {
      channelId: {}
    },
    data() {
      return {
        chatText: '',
        messageCollection: null,
        originalMessages: []
      };
    },
    computed: {
      messages() {
        return this.originalMessages;
      }
    },
    mounted() {

    },
    methods: {
      initMessageCollection() {
        const _this = this;

        const SendBirdSyncManager = MessengerService.getSendBirdSyncManager();

        this.messageCollection = new SendBirdSyncManager.MessageCollection(_this.channel);

        const messageCollectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
        messageCollectionHandler.onSucceededMessageEvent = (messages, action) => {
          console.log(action, messages);
        };

        this.messageCollection.setCollectionHandler(messageCollectionHandler);

        this.fetchPrevious();
      },

      fetchPrevious() {
        if (this.messageCollection) {
          this.messageCollection.fetchSucceededMessages('prev');
        }
      },

      fetchNext() {
        if (this.messageCollection) {
          this.messageCollection.fetchSucceededMessages('next');
        }
      },

      scrollToBottom() {
        const _this = this;
        setTimeout(function () {
          _this.$refs.listChat.scrollTop = _this.$refs.listChat.scrollHeight;
        });
        console.log('scroll bottom');
      },

      async send() {
        if (!this.chatText) {
          return;
        }

        const chatText = this.chatText;
        this.chatText = '';

        const message = await MessengerService.sendTextMessage(this.group, chatText);
        this.messageCollection.handleSendMessageResponse(message);

        this.scrollToBottom();
      }
    },
    watch: {
      channelId: {
        immediate: true,
        handler(channelId) {
          if (!channelId) {
            // Destroy
            return;
          }

          // Setup channel
          this.initMessageCollection();
        }
      }
    }
  };
</script>

<style scoped>

</style>
