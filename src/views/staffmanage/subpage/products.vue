<template>
  <div class="wrap">
    <div v-for="(company, key) in companies" :key="key">
      <h3 v-text="company.name"></h3>
      <div v-for="(product, key) in company.products" :key="key">
        <span v-text="product.name"></span>
        <el-checkbox-group v-model="products[product.id]">
          <el-checkbox label="处理"></el-checkbox>
          <el-checkbox label="负责"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <el-button type="primary" @click="handleSubmit()">设置</el-button>
  </div>
</template>

<script>
  import {
    getWithProducts,
    postProducts,
    getStaffproducts
  } from '../../../api/staffproduct';
  export default {
    data() {
      return {
        users: [],
        companies: [],
        productpass: [],
        checkedCities: [],
        cityOptions: [],
        product_ids: [],
        products: [],
        productIds: []
      }
    },
    methods: {
      // 获取客户员工管理产品列表
      getProductList() {
        const para = this.$route.params.id;
        let companies = null;

        getWithProducts()
          .then(({ data }) => {
            companies = data.data;

            return getStaffproducts(para);
          })
          .then(({ data }) => {
            const obj = {}

            data.data.forEach(item => {
              obj[item.product_id] = [];

              if (item.is_handler) {
                obj[item.product_id].push('处理');
              }
              if (item.is_manager) {
                obj[item.product_id].push('负责');
              }
            });

            companies.forEach(item => item.products.forEach(item => {
              this.productIds.push(item.id);
              this.products[item.id] = obj[item.id] || [];
            }));

            this.companies = companies;
          });
      },
      // 提交选择的产品信息
      handleSubmit() {
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          this.addLoading = true;

          const products = [];
          let length = 0;

          this.productIds.forEach(item => {
            if (this.products[item].length) {
              products[length] = {
                is_handler: 0,
                is_manager: 0,
                product_id: item
              };

              this.products[item].forEach(item => {
                switch (item) {
                  case '处理':
                    products[length].is_handler = 1;
                    break;
                  case '负责':
                    products[length].is_manager = 1;
                    break;
                }
              });

              length++;
            }
          });

          const postData = {
            staff_id: this.$route.params.id,
            products
          }

          postProducts(postData).then(() => {
            this.addLoading = false;
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.getProductList();
          });
        });
      }
    },
    mounted() {
      this.getProductList();
    }
  }

</script>

<style lang="scss" scoped>
  .wrap {
    margin: 30px 30px;

    & .el-checkbox-group {
      display: inline-block;
      margin-left: 30px;
    }

    & button {
      margin-top: 25px;
    }
  }
</style>
