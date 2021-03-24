<template>
    <div></div>
</template>

<script>
import Car from '../services/test.service';
export default {
  name: 'SyncManager',
  data() {
    return {
      uId: 'hai',
      sId: 'user1',
    };
  },
  mounted() {
    var carInstance = null;

    function Car (name, model) {
      if (carInstance) {
        return carInstance;
      }

      const _this = this;
      this.name = name;
      this.model = model;
      this.eventStarted = null;

      setTimeout(function () {
        _this.onStarted();
      }, 2000);

      this.getName2 = function () {
        return _this.name;
      }

      carInstance = this;
    }

    Car.prototype.getName = function () {
      return this.name;
    };

    Car.prototype.getModel = function () {
      return this.model;
    };

    Car.prototype.onStarted = function () {
      if (this.eventStarted) {
        this.eventStarted();
      }

      // Other block code.
    };

    // var car = new Car('Hyndai', '2021');
    //
    // const _this = this;
    //
    // car.eventStarted = function () {
    //   console.log('_this.uId: ', _this.uId);
    // };

    var car1 = new Car();
    var car2 = new Car();
    console.log(car1, car2, car1 === car2);
  },
};
</script>

<style scoped>

</style>
