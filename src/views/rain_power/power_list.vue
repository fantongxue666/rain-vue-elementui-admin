<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="角色名称" size="small">
        <el-input v-model="formInline.user" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" size="small">
        <el-select v-model="formInline.region" placeholder="角色状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="dialogFormVisible1=true">新增角色</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%;height:550px;overflow:scroll;">
      <el-table-column label="角色编号">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.rolename }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.rolename }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="角色状态">
        <el-switch
          slot-scope="scope"
          active-value="1"
          inactive-value="2"
          style="display: block;z-index:999;"
          v-model="scope.row.wlbz"
          active-color="#13ce66"
          inactive-color="#ff4949"
           disabled
        ></el-switch>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="getTreeByAccount(scope.$index,scope.row)">授权</el-button>
          <el-button size="mini" type="primary" @click="toEditUser(scope.$index,scope.row)">修改角色</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="totalCount"
    ></el-pagination>

    <!-- 更新角色弹框 -->
    <el-dialog title="更新角色信息" :visible.sync="dialogFormVisible2">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input size="small" style="width:40%;" v-model="formInline.user" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            active-value="1"
            inactive-value="2"
            style="display: block;margin-top:0.7%;"
            v-model="formInline.region"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增角色弹框 -->
    <el-dialog title="新增角色信息" :visible.sync="dialogFormVisible1">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input size="small" style="width:40%;" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="是否立即启用" :label-width="formLabelWidth">
          <el-switch
            active-value="1"
            inactive-value="2"
            style="display: block;margin-top:0.7%;"
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 授权弹框    -->
    <el-dialog title="角色授权" :visible.sync="dialogFormVisible">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="idss"
        :default-checked-keys="ids"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { getRoleList, addRoleUser, updateRoleUser,deleteRoleUser,getMenuByRole,saveRoles } from "../../api/user";
import service from "../../utils/request";
import { getRoutes } from '../../api/role';
import { getAccount } from '../../utils/auth';
export default {
  data() {
    return {
      roleid:'',
      pagesize: 10, //    每页的数据
      currentPage: 1, //第几页
      totalCount: 1, //总条数
      pages: 1, //总页数
      form: {
        name: "",
        status: ""
      },
      treeData: [],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      formInline: {
        id: "",
        user: "",
        region: ""
      },
      value: true,
      tableData: [],
      // fullscreenLoading: false,
      ids:[],
      idss:[]
    };
  },
  created() {
    this.getData(this.currentPage, this.pagesize);
  },

  methods: {
    //通过账号查询Tree
    getTreeByAccount(e,j){
      this.ids=[]
      this.dialogFormVisible = true
      this.roleid=j.id
      getMenuByRole(j.id).then(res=>{
        if(res.data.length>0){
            for(var i=0;i<res.data.length;i++){
              this.idss.push(res.data[i].id)
            }
          this.treeData=res.data
          this.ids=res.data[0].ids
        }else{
          this.ids=[]
          this.idss=[]
        }
      })


    },
    toEditUser(e, f) {
      this.formInline.user = f.rolename;
      this.formInline.region = f.wlbz;
      this.formInline.id = f.id;
      this.dialogFormVisible2 = true;
    },
    editUser() {
      this.dialogFormVisible2 = false;
      updateRoleUser({
        id: this.formInline.id,
        name: this.formInline.user,
        status: this.formInline.region
      }).then(res => {
        if (res.code === 200) {
          Message.success("更新成功");
          this.formInline = {
            id: "",
            user: "",
            region: ""
          };
          this.getData(this.currentPage, this.pagesize);
        } else {
          Message.error(res.message);
        }
      });
    },
    addUser() {
      this.dialogFormVisible1 = false;
      this.form.user = "";
      addRoleUser(this.form).then(res => {
        if (res.code === 200) {
          this.getData(this.currentPage, this.pagesize);
          Message.success("新增成功");
        } else {
          Message.error(res.message);
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData(val, this.pagesize);
    },
    getData(v, j) {
      getRoleList({
        pageNo: v,
        pageSize: j,
        name: this.formInline.user,
        status: this.formInline.region
      }).then(res => {
        this.tableData = res.data.list;
        this.totalCount = res.data.total;
        this.pages = res.data.pages;
      });
    },
    onSubmit() {
      this.getData(this.currentPage, this.pagesize);
    },
    handleEdit() {
      this.dialogFormVisible = false;
      const ids=this.$refs.tree.getCheckedKeys()
      const halfIds=this.$refs.tree.getHalfCheckedKeys()
      const resultIds=ids.concat(halfIds)
      saveRoles(this.roleid,resultIds).then(res=>{
        if(res.code===200){
           Message.success("授权成功");
        }
      })
     
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteRoleUser(row.id).then(res=>{
          if(res.code===200){
              Message.success('删除成功')
              this.getData(this.currentPage, this.pagesize);
          }else{
              Message.error(res.message)
          }
        })
        
      });
    }
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>