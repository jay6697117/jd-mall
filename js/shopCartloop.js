'use strict';
new Vue({
  el: '#app',
  data: {
    // 购物车中的数据
    shopListArr: [],
    // 是否全选
    isSelectedAll: false,
    // 所有商品的总价格
    totalPrice: 0,
    // 是否隐藏删除面板
    isHideDelPanel: true,
    // 当前要删除的一个商品
    currentDelShop: {}
  },
  // 组件已经加载完毕, 请求网络数据, 业务处理
  mounted() {
    // 请求本地的数据
    this.getLocalData();
  },

  // 过滤
  filters: {
    // 格式化金钱
    moneyFormat(money) {
      return '¥' + money.toFixed(2);
    }
  },

  methods: {
    // 1. 请求本地的数据
    getLocalData() {
      this.$http.get('data/cart.json').then(
        response => {
          const res = response.body;
          if (res) {
            this.shopListArr = res.allShops.shopList;
            console.log(this.shopListArr);
          }
        },
        response => {
          alert('请求数据失败!');
        }
      );
    },

    // 2. 单个商品的加减
    singerShopPrice(shop, flag) {
      if (flag) {
        // 加
        shop.shopNumber += 1;
      } else {
        // 减
        if (shop.shopNumber <= 1) {
          shop.shopNumber = 1;
          return;
        }
        shop.shopNumber -= 1;
      }

      // 计算总价
      this.getAllShopPrice();
    },

    // 3. 选中所有的商品
    selectedAll(flag) {
      // 3.1 总控制
      this.isSelectedAll = !flag;

      // 3.2 遍历所有的商品数据
      this.shopListArr.forEach((value, index) => {
        if (typeof value.checked === 'undefined') {
          this.$set(value, 'checked', !flag);
        } else {
          value.checked = !flag;
        }
      });

      // 3.3 计算总价格
      this.getAllShopPrice();
    },

    // 4. 计算商品的总价格
    getAllShopPrice() {
      let totalPrice = 0;
      // 4.1 遍历所有的商品
      this.shopListArr.forEach((value, index) => {
        // 判断商品是否被选中
        if (value.checked) {
          totalPrice += value.shopPrice * value.shopNumber;
        }
      });

      this.totalPrice = totalPrice;
    },

    // 5. 单个商品的选中和取消
    singerShopSelected(shop) {
      // 5.1 判断有没有这个属性
      if (typeof shop.checked === 'undefined') {
        this.$set(shop, 'checked', true);
      } else {
        shop.checked = !shop.checked;
      }

      // 5.2 计算总价
      this.getAllShopPrice();

      // 5.3 判断是否全选
      this.hasSelectedAll();
    },

    // 6. 判断是否全选
    hasSelectedAll() {
      let flag = true;
      this.shopListArr.forEach((value, index) => {
        if (!value.checked) {
          flag = false;
        }
      });
      this.isSelectedAll = flag;
    },

    // 7. 点击垃圾篓
    clickTrash(shop) {
      this.isHideDelPanel = false;
      this.currentDelShop = shop;
    },

    // 8. 删除当前的商品
    delShop() {
      // 8.1 隐藏面板
      this.isHideDelPanel = true;
      const index = this.shopListArr.indexOf(this.currentDelShop);
      this.shopListArr.splice(index, 1);

      // 8.2 计算总价格
      this.getAllShopPrice();
    }
  }
});
