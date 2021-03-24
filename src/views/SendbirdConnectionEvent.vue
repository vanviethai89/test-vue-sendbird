<template>
    <div>
        <ul>
        </ul>
    </div>
</template>

<script>
  import {sendBird, sendBirdConnection} from '../services/messenger.service';

export default {
  name: 'SendbirdConnectionEvent',
  data() {
    return {
      uId: 'van-viet-hai',
      sId: 'quarium-store',
    };
  },
  created() {
    const _this = this;

    var connectionHandler = new sendBird.ConnectionHandler();

    connectionHandler.onReconnectStarted = function() {alert('');};
    connectionHandler.onReconnectSucceeded = function() {alert('');};
    connectionHandler.onReconnectFailed = function() {alert('');};
    sendBird.addConnectionHandler('CONNECTION_HANDLER_ID', connectionHandler);


    var channelHandler = new sendBird.ChannelHandler();
    channelHandler.onChannelChanged = function (channel) {
        console.log('onChannelChanged', channel);
    };
    channelHandler.onChannelDeleted = function (channel) {
      console.log('onChannelDeleted', channel);
    };
    sendBird.addChannelHandler('CHANNEL_HANDLER_ID', channelHandler);


    sendBird.connect(this.uId, function (user, error) {
      if (error) {
        console.log('Connection is not established', error);
        return;
      }

      setTimeout(function () {
        sendBird.disconnect(function () {
          console.log('Disconnect success');
        });
      }, 5000);
      console.log('Connection is established');
    });
  },
};
</script>

<style scoped>

</style>
