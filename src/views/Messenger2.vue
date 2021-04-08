<template>
    <div>
        <Right></Right>
        <hr>
        <h1>Current channel id #{{ channelId }}</h1>
        <Left v-if="isConnectionEstablishment" :channel-id="channelId"></Left>
        <input v-model="modalChannelId" /><button @click="setChannel">Set Channel</button>
    </div>
</template>

<script>
  import MessengerService from '../services/messenger2.service';

  import Right from '../components/Right';
  import Left from '../components/Left';

  export default {
    name: 'Messenger2',
    components: { Right, Left },
    data() {
      return {
        uId: 'vanviethai',
        loading: true,
        isConnectionEstablishment: false,
        channelId: null,
        modalChannelId: '',
        intervalHandler: null,
      }
    },
    created() {
      const _this = this;

      Promise.all([MessengerService.connectToUser(this.uId), MessengerService.setupSyncManager(this.uId)]).then((values) => {
        _this.isConnectionEstablishment = true;
      });

      this.intervalHandler = setInterval(async function() {
        const totalUnreadChannel = await MessengerService.getTotalUnreadChannelCount();
        console.log('Total unread channel count: ', totalUnreadChannel);
      }, 5000);
    },
    methods: {
      setChannel() {
        this.channelId = String(this.modalChannelId);
      }
    }
  };
</script>

<style scoped>

</style>
