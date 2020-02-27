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
        <el-table-column prop="id" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="公司名称">
        </el-table-column>
        <el-table-column prop="address" label="公司地址" width="200">
        </el-table-column>

        <el-table-column label="操作" width="400">
          <template scope="scope">
            <el-button size="small" @click="handleShow(scope.row.id, scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
            <el-button size="small" @click.native="handleGo(scope.row.id, scope.row)">员工管理</el-button>
            <el-button size="small" @click="handleProduct(scope.row.id, scope.row)">产品管理</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.row.id, scope.row)">删除</el-button>

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
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="公司名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司地址" prop="address">
            <el-input v-model="addForm.address" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="公司姓名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="editForm.address" auto-complete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--查看界面-->
      <el-dialog title="查看" v-model="showDetailVisible" :close-on-click-modal="false">
        <el-form :model="showDetail" label-width="80px">
          <el-form-item label="公司姓名:" prop="name">
            <el-span>
              {{ showDetail.name }}
            </el-span>
          </el-form-item>
          <el-form-item label="公司地址:" prop="address">
            <el-span>
              {{ showDetail.address }}
            </el-span>
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
    removeUser,
    // batchRemoveUser,
    // editUser,
    // addUser,
    saveCompany,
    getCompanyList,
    editCompany
  } from '../../api/clientcompany';
  import { validateClientCompany } from '../../utils/validate';
  export default {
    data() {
      const clientCompanyName = (rule, value, callback) => {
        if (validateClientCompany(value)) {
          callback();
        } else {
          callback(new Error('请输入公司名称'));
        }
      }
      const clientCompanyAddress = (rule, value, callback) => {
        if (validateClientCompany(value)) {
          callback();
        } else {
          callback(new Error('请输入公司地址'));
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
            { required: true, trigger: 'blur', validator: clientCompanyName }
          ],
          address: [
            { required: true, trigger: 'blur', validator: clientCompanyAddress }
          ]
        },
        // 编辑界面数据
        editForm: {
          id: 0,
          name: '',
          address: ''
        },
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, trigger: 'blur', validator: clientCompanyName }
          ],
          address: [
            { required: true, trigger: 'blur', validator: clientCompanyAddress }
          ]
        },
        // 新增界面数据
        addForm: {
          name: '',
          address: ''
        },
        showDetailVisible: false,
        // 编辑界面数据
        showDetail: {
          id: 0,
          name: '',
          ddress: ''
        },
        currentPage3: 5,
        listQuery: {
          page: 1
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
        this.listLoading = true;
        // NProgress.start();
        getCompanyList(this.listQuery).then(res => {
          this.companies = res.data.data.lists;
          this.listLoading = false;
          this.total = res.data.data.length
          // NProgress.done();
        });
      },
      // 删除
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          // NProgress.start();
          const id = [row.id];
          removeUser(id).then(() => {
            this.listLoading = false;
            // NProgress.done();
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
          address: ''
        };
      },
      // 编辑
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              // NProgress.start();
              const para = Object.assign({}, this.editForm);
              editCompany(para).then(() => {
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
              this.addLoading = true;
              const para = Object.assign({}, this.addForm);
              saveCompany(para).then(() => {
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
          removeUser(id).then(() => {
            this.listLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getUsers();
          });
        });
      },
      handleSizeChange() {
        this.listQuery.page = 2;
        this.getUsers();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getUsers();
      },
      handleGo(index) {
        const cid = index;
        this.$router.push('/clientcompany/subpage/customer/' + cid);
      },
      handleProduct(index, row) {
        const pid = row.id;
        this.$router.push('/clientcompany/subpage/products/' + pid);
      }
    },
    mounted() {
      this.getUsers();
    }
  }

</script>