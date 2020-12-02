<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="角色名称" size="small">
        <el-input v-model="formInline.user" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色状态" size="small">
        <el-select v-model="formInline.region" placeholder="角色状态">
          <el-option label="启用" value="shanghai"></el-option>
          <el-option label="禁用" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%;height:550px;">
      <el-table-column label="角色编号" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="120">
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
        <el-switch  slot-scope="scope"
        active-value="1"
        inactive-value="2"
          style="display: block;z-index:999;"
          v-model="scope.row.wlbz"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="启用"
          inactive-text="禁用"
        ></el-switch>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="dialogFormVisible = true">授权</el-button>
          <el-button size="mini" type="primary" @click="dialogFormVisible = true">修改角色</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
     background layout="prev, pager, next" :total="totalCount"></el-pagination>

    <!-- 新增角色弹框 -->
    <el-dialog title="新增角色信息" :visible.sync="dialogFormVisible1">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 授权弹框    -->
    <el-dialog title="角色授权" :visible.sync="dialogFormVisible">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
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
import { getRoleList } from '../../api/user';
import service from '../../utils/request';

export default {
  data() {
    return {
        pagesize:3,    //    每页的数据
        currentPage:1,//第几页
        totalCount:1,//总条数 
        pages:1,  //总页数
        form:{
            name:""
        },
      treeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      formInline: {
        user: "",
        region: ""
      },
      value: true,
      tableData: [
       
      ]
    };
  },
  created(){
      
      this.getData(this.currentPage,this.pagesize)
      
  },
  methods: {
      handleCurrentChange(val){
        this.currentPage = val
        this.getData(val,this.pagesize)
      },
    getData(v,j){
        getRoleList({pageNo:v,pageSize:j}).then(res=>{
          this.tableData=res.data.list
          this.totalCount=res.data.total
          this.pages=res.data.pages
      })
    },
    onSubmit() {
      console.log("submit!");
    },
    handleEdit() {
      this.dialogFormVisible = false;
      Message.success("授权成功");
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    }
  }
};
</script>