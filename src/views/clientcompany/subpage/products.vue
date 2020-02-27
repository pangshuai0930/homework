<template>
  <div class="app-container">
    <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getUsers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="companies" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="name" label="产品名称">
        </el-table-column>
        <el-table-column prop="status" label="产品状态" width="200">
          <template scope="scope">
            <span v-if="scope.row.status == 1">签约中</span>
            <span v-if="scope.row.status == 2">开发中</span>
            <span v-if="scope.row.status == 3">维护中</span>
            <span v-if="scope.row.status == 4">停用中</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" width="200">
        </el-table-column>
        <el-table-column label="操作" width="299">
          <template scope="scope">
            <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" style="float:right;">
        </el-pagination>
      </el-col>

      <!--新增界面-->
      <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品状态" prop="status">
            <el-select class="filter-item" v-model="addForm.status" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              required
              v-model="addForm.start_time"
              type="date"
              placeholder="选择日期"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="钉钉 WebHook 地址" prop="dingtalk_webhook">
            <el-input v-model="addForm.dingtalk_webhook" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品状态" prop="status">
            <el-select class="filter-item" v-model="editForm.status" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" placeholder="请选择">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              required
              v-model="editForm.start_time"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="钉钉 WebHook 地址" prop="dingtalk_webhook">
            <el-input v-model="editForm.dingtalk_webhook" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--查看界面-->
      <el-dialog title="查看" v-model="showDetailVisible" :close-on-click-modal="false">
        <el-form :model="showDetail">
          <el-form-item label="产品名称:" prop="name">
            <span v-text="showDetail.name"></span>
          </el-form-item>
          <el-form-item label="产品状态:" prop="status">
            <span v-if="showDetail.status == 1">签约中</span>
            <span v-if="showDetail.status == 2">开发中</span>
            <span v-if="showDetail.status == 3">维护中</span>
            <span v-if="showDetail.status == 4">停用中</span>
          </el-form-item>
          <el-form-item label="开始时间:" prop="start_time">
            <span v-text="showDetail.start_time"></span>
          </el-form-item>
          <el-form-item label="钉钉 WebHook 地址:" prop="dingtalk_webhook">
            <span v-text="showDetail.dingtalk_webhook"></span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="showDetailVisible = false">取消</el-button>
        </div>
      </el-dialog>

    </section>
  </div>
</template>

<script>
  import {
    // getUserListPage,
    removeProducts,
    // batchRemoveUser,
    // editUser,
    // addUser,
    getProductsList,
    editProducts,
    saveProducts
  } from '../../../api/products';
  import {
    validateClientCompany,
    validateStartTime
  } from '../../../utils/validate';
  const calendarTypeOptions = [
    { key: '1', display_name: '签约中' },
    { key: '2', display_name: '开发中' },
    { key: '3', display_name: '维护中' },
    { key: '4', display_name: '停用中' }
  ]
  // const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  //   acc[cur.key] = cur.display_name;
  //   return acc
  // }, {});
  export default {
    data() {
      const validateProductName = (rule, value, callback) => {
        if (validateClientCompany(value)) {
          callback();
        } else {
          callback(new Error('产品名称最少四位'));
        }
      }
      return {
        filters: {
          name: ''
        },
        users: [],
        companies: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [], // 列表选中列
        editFormVisible: false, // 编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, trigger: 'blur', validator: validateProductName }
          ],
          status: [
            { required: true, message: '请选择产品状态', trigger: 'change' }
          ]
        },
        calendarTypeOptions,
        // 编辑界面数据
        editForm: {
          name: '',
          status: '',
          start_time: '',
          company_id: parseInt(this.$route.params.pid),
          id: this.productId
        },
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, trigger: 'blur', validator: validateProductName }
          ],
          status: [
            { required: true, message: '请选择产品状态', trigger: 'change' }
          ]
        },
        // 新增界面数据
        addForm: {
          name: '',
          status: '',
          start_time: '',
          company_id: parseInt(this.$route.params.pid)
        },
        showDetailVisible: false,
        // 编辑界面数据
        showDetail: {
          status: 0,
          name: '',
          start_time: ''
        },
        currentPage3: 5,
        listQuery: {
          page: 1
        },
        productId: null,
        temp: {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          type: '',
          status: 'published'
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      }
    },
    methods: {
      // 性别显示转换
      formatSex(row) {
        return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知';
      },
      // handleCurrentChange(val) {
      // },
      // 获取用户列表
      getUsers() {
        const para = this.$route.params.pid
        getProductsList(para, this.listQuery).then(res => {
          this.companies = res.data.data.lists;
        });
      },
      // 删除
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          const id = [row.id];
          removeProducts(id).then(() => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        });
      },
      // 显示编辑界面
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.productId = row.id
        switch (this.editForm.status) {
          case 1:
            this.editForm.status = '1'
            break;
          case 2:
            this.editForm.status = '2'
            break;
          case 3:
            this.editForm.status = '3'
            break;
          case 4:
            this.editForm.status = '4'
            break;
        }
      },
      // 显示详情
      handleShow(index, row) {
        this.showDetailVisible = true;
        this.showDetail = Object.assign({}, row);
      },
      // 显示新增界面
      handleAdd() {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          status: '',
          start_time: '',
          company_id: parseInt(this.$route.params.pid)
        };
      },
      // 编辑
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              const date = this.editForm.start_time;

              this.editLoading = true;
  
              if (!validateStartTime(String(date))) {
                this.editForm.start_time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              }

              const para = Object.assign(this.editForm, {});

              editProducts(para).then(() => {
                this.editLoading = false;
                // NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs.editForm.resetFields();
                this.editFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      // 新增
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              const date = this.addForm.start_time;
  
              this.addLoading = true;

              if (!validateStartTime(String(date))) {
                this.addForm.start_time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              }

              const para = Object.assign(this.addForm, {});
  
              saveProducts(para).then(() => {
                this.addLoading = false;
                // NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs.addForm.resetFields();
                this.addFormVisible = false;
                this.getUsers();
              });
            });
          }
        });
      },
      selsChange(sels) {
        this.sels = sels;
      },
      // 批量删除
      batchRemove() {
        const ids = this.sels.map(item => item.id)
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          const id = [ids][0]
          removeProducts(id).then(() => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        });
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getUsers();
      }
    },
    mounted() {
      this.getUsers();
    }
  }

</script>