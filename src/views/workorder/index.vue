<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="addForm" ref="addForm">
          <el-form-item style="float: right;">
            <el-button type="info" @click="() => $router.push('/workorder/index')">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
          <el-form-item label="产品" style="float: right;">
            <el-cascader
              :options="options"
              v-model="selectedOptions" style="width: 400px">
            </el-cascader>
          </el-form-item>
          <el-form-item label="标题" prop="search_title" style="float: right;">
            <el-input auto-complete="off" v-model="addForm.search_title"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="workorderList"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;">
        <el-table-column  prop="wid" width="150" label="工单编号">
        </el-table-column>
        <el-table-column prop="title" label="标题">
          <template scope="scope">
            <router-link :to="`/workorder/subpage/detail/${scope.row.wid}`">
              <a class="title" v-text="scope.row.title"></a>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品" width="200">
        </el-table-column>
        <el-table-column prop="created_at" label="日期" width="210">
        </el-table-column>
        <el-table-column prop="is_urgent" label="紧急" width="120">
          <template scope="scope">
            <span v-bind:style="{color: scope.row.is_urgent ? '#ff4949' : ''}">{{ scope.row.is_urgent ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template scope="scope">
            <el-tag v-text="status[scope.row.status]" :type="statusType[scope.row.status]"></el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar" style="margin-top:15px;">
        <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
        <el-pagination layout="total, prev, pager, next" :current-page="listQuery.page" @current-change="handleCurrentChange" style="float:right;" :page-size="per_page" :total="totals">
        </el-pagination>
      </el-col>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .title {
    color: #06C;
  }
</style>

<script>
  import {
    getWorkorderList,
    getCompaniesWithProducts
  } from '@/api/workorders';
  import {
    composeQuery,
    isEmptyObject
  } from '@/utils/';

  export default {
    data() {
      return {
        products: [],
        totals: 0,
        workorderList: [],
        total: 0,
        per_page: 10,
        listLoading: false,
        sels: [], // 列表选中列
        status: [
          '不限',
          '分派中',
          '处理中',
          '待客户反馈',
          '客户确认完成',
          '已分派',
          '推迟处理',
          '待您确认完成',
          '待客户评价',
          '已关闭'
        ],
        statusType: [
          '',
          '',
          'gray',
          'danger',
          'success',
          'warning',
          '',
          'danger',
          'danger',
          'gray'
        ],
        listQuery: {
          page: 1
        },
        addForm: {
          company_id: '',
          product_id: '',
          search_title: ''
        },
        searchworkorder: '',
        options: [],
        selectedOptions: []
      }
    },
    methods: {
      // 显示详情
      handleShow(index, row) {
        this.$router.push('/workorder/subpage/detail/' + row.wid);
      },
      selsChange(sels) {
        this.sels = sels;
      },
      // 分页点击刷新列表
      handleCurrentChange(page) {
        this.addForm.page = page;
        this.listQuery.page = page;
        this.$router.push(`/workorder/index${composeQuery(this.addForm)}`);
      },
      // 点击提交工单
      handleProduct() {
        this.$router.push('/workorder/subpage/submit');
      },
      // 获取搜索列表
      handleSearch() {
        let flag = true;
        const selectedOptions = this.selectedOptions;
        const query = Object.assign(this.addForm, {
          company_id: String(selectedOptions[0]),
          product_id: String(selectedOptions[1])
        });

        this.listQuery.page = 1;
        this.addForm.page = 1;

        Object.keys(query).forEach(key => {
          if (String(this.$route.query[key]) !== String(query[key])) {
            flag = false;
            return;
          }
        });

        if (flag) {
          this.listLoading = true;

          getWorkorderList(this.$route.query)
            .then(({ data }) => {
              this.workorderList = data.data.lists;
              this.totals = data.data.total;
              this.per_page = data.data.per_page;
              this.listLoading = false;
            })
            .catch(() => {
              this.$message.error('获取数据失败，请重新尝试！');
            });
        } else {
          this.$router.push(`/workorder/index${composeQuery(query)}`);
        }
      }
    },
    mounted() {
      const query = this.$route.query;
      const promises = [
        getWorkorderList(query),
        getCompaniesWithProducts()
      ]
  
      this.listLoading = true;

      Promise.all(promises)
        .then(results => {
          const res = results[0];
          const data = results[1].data;

          this.workorderList = res.data.data.lists;
          this.totals = res.data.data.total;
          this.per_page = res.data.data.per_page;
          this.listLoading = false;

          Object.keys(query).forEach(key => this.addForm[key] = query[key]);
  
          data.data.forEach(item => {
            const el = {
              value: String(item.id),
              label: item.name,
              children: []
            };

            item.products.forEach(product => el.children.push({
              value: String(product.id),
              label: product.name
            }));

            this.options.push(el);
            this.selectedOptions.push(String(query.company_id));
            this.selectedOptions.push(String(query.product_id));
          });
        })
        .catch(() => {
          this.$message.error('获取数据失败，请重新尝试！');
        });
    },
    watch: {
      '$route'(to) {
        this.listLoading = true;

        getWorkorderList(to.query)
          .then(({ data }) => {
            this.workorderList = data.data.lists;
            this.totals = data.data.total;
            this.per_page = data.data.per_page;
            this.listQuery.page = parseInt(to.query.page) || 1;
            this.listLoading = false;

            if (isEmptyObject(to.query)) {
              Object.keys(this.addForm).forEach(key => this.addForm[key] = '');
              this.selectedOptions = [];
            }
          })
          .catch(() => {
            this.$message.error('获取数据失败，请重新尝试！');
          });
      }
    }
  }
</script>