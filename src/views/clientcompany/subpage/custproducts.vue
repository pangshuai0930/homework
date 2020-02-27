<template>
<div style="margin: 30px 30px;">
  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
    <el-checkbox v-if="products.length > 0"
      v-for="(product, key) in products"
      :label="product.id"
      :key="key">
      {{product.name}}
    </el-checkbox>
  </el-checkbox-group>
  <el-button size="small" @click="handleSubmit()"  style="margin: 30px 100px;width: 100px;">提交</el-button>
 </div> 
</template>

<script>
import {
    getCustproducts,
    getProductsByCompany,
    postProducts
 } from '../../../api/custproducts';
export default {
  data() {
    return {
      users: [],
      products: [],
      productpass: [],
      checkedCities: [],
      cityOptions: [],
      product_ids: []
    }
  },
  methods: {
    // 获取客户员工管理产品列表
    getProductList() {
      const cid = this.$route.params.cid
      getProductsByCompany(cid).then(res => {
        this.products = res.data.data.lists;
      });
    },
    // 获取客户员工已管理产品列表
    getProductListPass() {
      const para = this.$route.params.id;
      getCustproducts(para).then(res => {
        this.checkedCities = res.data.data.product_ids;
      });
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      console.log(value);
      this.product_ids = value;
      this.checkAll = checkedCount === this.products.length;
    },
    // 提交客户员工的选择
    handleSubmit() {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.addLoading = true;
        const addForm = {
          customer_id: this.$route.params.id,
          product_ids: this.product_ids
        }
        const para = Object.assign({}, addForm);
        postProducts(para).then(() => {
          this.addLoading = false;
          // NProgress.done();
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.$refs.addForm.resetFields();
          this.getProductList();
        });
      });
    }
  },
  mounted() {
    this.getProductList();
    this.getProductListPass();
  }
}
</script>
