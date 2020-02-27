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
        <el-table-column prop="username" label="帐号">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="300">
        </el-table-column>
        <el-table-column prop="telphone" label="电话" width="280">
        </el-table-column>
        <el-table-column label="操作" width="330">
          <template scope="scope">
            <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" @click="handleProduct(scope.$index, scope.row)">产品设置</el-button>
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
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="帐号" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="telphone">
            <el-input v-model="addForm.telphone" auto-complete="off"></el-input>
          </el-form-item>
          </el-table-column>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--编辑界面-->
      <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="帐号" prop="username">
            <el-input v-model="editForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="telphone">
            <el-input v-model="editForm.telphone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password" auto-complete="off"></el-input>
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
          <el-form-item label="帐号:" prop="username">
            <span>
              {{ showDetail.username }}
            </span>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <span>
              {{ showDetail.email }}
            </span>
          </el-form-item>
          <el-form-item label="电话:" prop="telphone">
            <span>
              {{ showDetail.telphone }}
            </span>
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
    removeStaff,
    // batchRemoveUser,
    // editUser,
    // addUser,
    saveStaff,
    getStaffsList,
    editStaff
  } from '../../api/staffmanage';
  import {
    validateEmail,
    validateTelphone,
    validatePassword,
    validateUsername
  } from '../../utils/validate';
  export default {
    data() {
      const validateUsernameRules = (rule, value, callback) => {
        if (validateUsername(value)) {
          callback();
        } else {
          callback(new Error('员工帐号最少6位'));
        }
      }
      const validateEmailRules = (rule, value, callback) => {
        if (validateEmail(value)) {
          callback();
        } else {
          callback(new Error('请输入正确邮箱'));
        }
      }
      const validateTelphoneRules = (rule, value, callback) => {
        if (!validateTelphone(value)) {
          callback(new Error('请输入员工手机'));
        } else {
          callback();
        }
      }
      const validatePasswordRules = (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error('账户密码最少6位'));
        } else {
          callback();
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
          username: [
            { required: true, trigger: 'blur', validator: validateUsernameRules }
          ],
          email: [
            { required: true, trigger: 'blur', validator: validateEmailRules }
          ],
          telphone: [
            { required: true, trigger: 'blur', validator: validateTelphoneRules }
          ],
          password: [
            { required: true, trigger: 'blur', validator: validatePasswordRules }
          ]
        },
        // 编辑界面数据
        editForm: {
          id: 0,
          username: '',
          password: '',
          email: '',
          telphone: ''
        },
        addFormVisible: false, // 新增界面是否显示
        addLoading: false,
        addFormRules: {
          username: [
            { required: true, trigger: 'blur', validator: validateUsernameRules }
          ],
          email: [
            { required: true, trigger: 'blur', validator: validateEmailRules }
          ],
          telphone: [
            { required: true, trigger: 'blur', validator: validateTelphoneRules }
          ],
          password: [
            { required: true, trigger: 'blur', validator: validatePasswordRules }
          ]
        },
        // 新增界面数据
        addForm: {
          username: '',
          email: '',
          telphone: '',
          password: ''
        },
        showDetailVisible: false,
        // 编辑界面数据
        showDetail: {
          id: 0,
          username: '',
          email: '',
          telphone: '',
          password: 'admin'
        },
        currentPage3: 5,
        listQuery: {
          page: 1
        },
        staffId: null
      }
    },
    methods: {
      // 性别显示转换
      formatSex(row) {
        return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '未知';
      },
      // 获取用户列表
      getUsers() {
        this.listLoading = true;
        // NProgress.start();
        getStaffsList(this.listQuery).then(res => {
          this.companies = res.data.data.lists;
          this.listLoading = false;
          // NProgress.done();
          console.log(res, '这是getStaffsList的res')
        });
      },
      // 删除
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          const id = [row.id];
          // console.log(id, '这是id')
          removeStaff(id).then(() => {
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
        this.staffId = row.id;
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
          username: '',
          email: '',
          telphone: '',
          password: ''
        };
      },
      // 编辑
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              // NProgress.start();
              const para = this.editForm;
              console.log(para, '这是编辑的para');
              editStaff(para).then(() => {
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
              saveStaff(para).then(() => {
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
          const id = [ids][0];
          removeStaff(id).then(() => {
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
      },
      // handleGo(index, row) {
      // },
      handleProduct(index, row) {
        const id = row.id;
        console.log(row);
        this.$router.push('/staffmanage/subpage/product/' + id);
      }
    },
    mounted() {
      this.getUsers();
    }
  }

</script>