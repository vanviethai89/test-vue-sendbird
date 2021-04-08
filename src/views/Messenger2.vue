<template>
    <div>
        <Right></Right>
    </div>
</template>

<script>
  import MessengerService from '../services/messenger2.service';
    import Right from '../components/Right';
  export default {
    name: 'Messenger2',
    components: {Right},
    data() {
      return {

      }
    },
    mounted() {
      setInterval(async function() {
        const totalUnreadChannel = await MessengerService.getTotalUnreadChannelCount();
        console.log('Total unread channel count: ', totalUnreadChannel);
      }, 5000);
    }
  };
</script>

<style scoped>

</style>
