<template>
  <el-card class="box-card">

    <div class="tools">
        <div class="tools-left">
                    <el-input
                      v-model="urlParams.search"
                      placeholder="请输入凭据名称"
                      @keyup.enter="onSearch"
                      clearable
                      @clear="onSearch"
                      class="search"
                    />
                    <el-button type="primary" @click="onSearch"><el-icon><search /></el-icon>&nbsp;搜索</el-button>
        </div>
         <div class="tools-right">
                    <el-button type="primary" @click="createDiglogVisible = true"><el-icon><Plus /></el-icon>&nbsp;新建</el-button>

                <!--展示列弹出框-->
                <el-popover placement="left" :width="100" v-model:visible='columnVisible'>
                  <template #reference>
                    <el-button type="primary" @click="columnVisible = true"><el-icon><setting /></el-icon>&nbsp;展示列</el-button>
                  </template>
                    <el-checkbox v-model="showColumn.k8sapi_ip" disabled>集群高可用IP地址</el-checkbox>
                    <el-checkbox v-model="showColumn.name" disabled>凭据名称</el-checkbox>
                    <el-checkbox v-model="showColumn.auth_mode">认证方式</el-checkbox>
                    <el-checkbox v-model="showColumn.k8s_token">k8s_tonken</el-checkbox>
                    <el-checkbox v-model="showColumn.private_key">私钥文件</el-checkbox>
                    <el-checkbox v-model="showColumn.note">备注</el-checkbox>
                    <el-checkbox v-model="showColumn.k8s_status">集群健康状态</el-checkbox>
                    <el-checkbox v-model="showColumn.create_time">创建时间</el-checkbox>
                    <el-checkbox v-model="showColumn.update_time">更新时间</el-checkbox>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" type="primary" @click="saveColumn">确认</el-button>
                      <el-button size="small" type="text" @click="columnVisible = false">取消</el-button>
                    </div>
                </el-popover>
         </div>
    </div>

       <el-table
               :data="tableData"
               border
               style="width: 100%"
       >
        <el-table-column prop="name" label="凭据名称" fixed="left" sortable v-if="showColumn.name"/>
          <el-table-column prop="auth_mode" label="认证方式" sortable v-if="showColumn.auth_mode">
            <template #default="scope">
              <el-tag type="primary" v-if="scope.row.auth_mode == 1">tonken</el-tag>
              <el-tag type="primary" v-if="scope.row.auth_mode == 2">kubeconfig</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="k8sapi_ip" label="集群IP地址" sortable v-if="showColumn.k8sapi_ip"/>

          <el-table-column prop="k8s_token" label="k8s秘钥" sortable v-if="showColumn.k8s_token">
            <template #default="scope">
              <span v-if="scope.row.k8s_token">******</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="private_key" label="私钥" sortable :show-overflow-tooltip="true" v-if="showColumn.private_key">
            <template #default="scope">
              <span v-if="scope.row.private_key">******</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注" v-if="showColumn.note"/>

          <el-table-column prop="k8s_status" label="集群健康状态" sortable v-if="showColumn.k8s_status">
            <template #default="scope">
              <el-tag type="primary" v-if="scope.row.k8s_status == 0">可用</el-tag>
              <el-tag type="primary" v-if="scope.row.k8s_status == 1">不可用</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="create_time" label="创建时间" sortable v-if="showColumn.create_time"/>
          <el-table-column prop="update_time" label="更新时间" sortable v-if="showColumn.update_time"/>
        <el-table-column fixed="right" label="操作栏" width="250" flexd>
          <template #default="scope">
            <el-button type="red" size="small" @click="k8s_status(scope.$index, scope.row)">检查</el-button>
            <el-button type="primary" size="small" @click="Edit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="Delete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div style="margin-top: 20px">
        <el-pagination
          v-model:currentPage="currentPage"
          :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
  </el-card>

<k8s_colonyEdit v-model:visible="editDiglogVisible"  :row="currentRow"></k8s_colonyEdit>
<k8s_colonyCreate v-model:visible="createDiglogVisible"></k8s_colonyCreate>


</template>

<script>
    import k8s_colonyEdit from "@/views/k8s_colony/k8s_colonyEdit";
    import k8s_colonyCreate from "@/views/k8s_colony/k8s_colonyCreate";

    export default {
        name: "k8s_colony",
        data() {
            return {
                tableData: '',
                currentPage: 1, // 默认第一页
                pageSize: 5, // 默认每页10条
                total: 0, // 默认总条数
                urlParams: {  // URL查询参数，每次调用都要带上
                    page_num: 1,
                    page_size: 5,
                    search: ''
                },
                currentRow: '',
                private_key: '',
                editDiglogVisible: false,
                createDiglogVisible: false,
                showColumn: {
                  k8sapi_ip: true,
                  k8s_token: true,
                  name: true,
                  city: true,
                  provider: true,
                  note: true,
                  create_time: true,
                  // k8s_status: true,
                },
                columnVisible: false
            }
        },
    mounted() {
      this.getData()
      // 从浏览器本地存储获取历史存储展示
      const columnSet = localStorage.getItem(this.$route.path + '-columnSet');
          if(columnSet) {
            this.showColumn = JSON.parse(columnSet)
          }
    },
    methods: {
        getData() {
          this.$http.get('/k8s/node/',{params:this.urlParams})
              .then(res => {
                  this.tableData = res.data.data;
                  // console.log(res.data.data)
                  this.total = res.data.count;
              })
        },

         k8s_status(index,row) {
             this.private_key = row;
             if (row.private_key) {
                 this.$http.post('/k8s/k8s_status/', {params: {'private_key': row.private_key,'id':row.id}})
                     .then(res => {
                         console.log(res.data.code)
                         if (res.data.code === 200) {
                             this.$message.success('验证成功');
                             this.getData();
                         }else {
                             // this.$message.error('验证失败！')
                             this.getData();
                         }
                     })
             }
         },
        // 分页：监听【选择每页数量】的事件
        handleSizeChange(pageSize) {
            // console.log(pageSize)
            this.pageSize = pageSize; // 重新设置分页显示
            this.urlParams.page_size = pageSize;  // 将最新值设置到数据里，用于下面用新值重新获取数据
            this.getData()
        },
        // 分页：监听【点击页码】的事件
        handleCurrentChange(currentPage){
            // console.log(currentPage)
            this.currentPage = currentPage; // 重新设置分页显示
            this.urlParams.page_num = currentPage;
            this.getData()
        },
        Edit(index,row){
            this.currentRow = row; // 将当前行内容传递给子组件
            console.log(this.currentRow)
            this.editDiglogVisible = true;
            console.log(this.editDiglogVisible)
        },
        Delete(index, row){
        console.log(index, row);
        this.$confirm("你确定要删除选中的吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
          })
          .then(() => {  // 点击确定
            this.$http.delete('/k8s/node/'+ row.id + '/')
                .then(res => {
                  if(res.data.code == 200) {
                    this.$message.success(res.data.msg);
                    this.tableData.splice(index, 1); // 根据表格索引临时删除数据
                  }
                });
          })
        },
        // 查询提交（携带search重新查询）
        onSearch() {
            this.getData()
        },
        saveColumn() {
            // 将可显示的字段存储到浏览器本地存储
            localStorage.setItem(this.$route.path + '-columnSet', JSON.stringify(this.showColumn));
            this.columnVisible = false;
}

    },
    //注册子组件
        components: {
            k8s_colonyEdit,
            k8s_colonyCreate,
        }

};
</script>

<style scoped>
    .tools {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .tools-left {
        display: flex;
    }
    .tools-right {
        display: flex;
    }
    .search {
        wieth: 100px;
        margin-right: 10px;
    }
</style>