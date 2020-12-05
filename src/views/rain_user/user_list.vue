<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="账号" size="small">
        <el-input v-model="formInline.account" placeholder="用户账号"></el-input>
      </el-form-item>
      <el-form-item label="昵称" size="small">
        <el-input v-model="formInline.username" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item size="small">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%;height:550px;overflow:scroll;">
      <el-table-column label="ID">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.username }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="当前角色">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.rolename }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.rolename }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="getTreeByAccount(scope.$index,scope.row)">查看</el-button>
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
  </div>
</template>

<script>
import { Message } from "element-ui";
import { getAuthUserList } from "../../api/user";
import service from "../../utils/request";
import { getRoutes } from "../../api/role";
import { getAccount } from "../../utils/auth";
export default {
  data() {
    return {
      pagesize: 10, //    每页的数据
      currentPage: 1, //第几页
      totalCount: 1, //总条数
      pages: 1, //总页数
      formInline: {
        account: "",
        username: ""
      },
      value: true,
      tableData: []
    };
  },
  created() {
    this.getData(this.currentPage, this.pagesize);
  },

  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData(val, this.pagesize);
    },
    getData(v, j) {
      getAuthUserList({
        pageNo: v,
        pageSize: j,
        account: this.formInline.account,
        username: this.formInline.username
      }).then(res => {
        this.tableData = res.data.list;
        this.totalCount = res.data.total;
        this.pages = res.data.pages;
      });
    },
    onSubmit() {
        this.getData(this.currentPage, this.pagesize);
    }
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>