<template>
    <el-card class="box-card">
    <div class="tools">
       <div class="tools-left">
            <el-input
              v-model="urlParams.search"
              placeholder="请输入关键字"
              @keyup.enter="onSearch"
              clearable
              @clear="onSearch"
              class="search"
            />
            <el-button type="primary" @click="onSearch"><el-icon><search /></el-icon>&nbsp;搜索</el-button>
       </div>

        <div class="tools-right">
            <el-button type="primary"  @click="createDialogVisible = true"><el-icon><plus /></el-icon>&nbsp;创建</el-button>
            <!--展示列弹出框-->
            <el-popover placement="left" :width="100" :visible="columnVisible">
                <template #reference>
                <el-button type="primary" @click="columnVisible = true"><el-icon><setting /></el-icon>&nbsp;展示列</el-button>
                </template>
                <el-checkbox v-model="showColumn.name" disabled>应用名称</el-checkbox>
                <el-checkbox v-model="showColumn.english_name" disabled>英文名称</el-checkbox>
                <el-checkbox v-model="showColumn.project">项目名称</el-checkbox>
                <el-checkbox v-model="showColumn.note">备注</el-checkbox>
                <el-checkbox v-model="showColumn.create_time">创建时间</el-checkbox>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" @click="columnVisible = false">取消</el-button>
                  <el-button size="small" type="primary" @click="saveColumn">确认</el-button>
                </div>
            </el-popover>
        </div>
    </div>




    <el-table
        ref="Table"
        :data="tableData"
        border
        prop
        style="width: 100%"
        :header-cell-style="{ background: '#F0F2F5' }"
      >
          <el-table-column prop="name" label="应用名称" fixed="left" sortable v-if="showColumn.name"/>
          <el-table-column prop="english_name" label="英文名称" fixed="left" sortable v-if="showColumn.english_name"/>
          <el-table-column prop="project" label="项目名称" fixed="left" sortable v-if="showColumn.project">
            <template #default="scope">
              {{scope.row.project.name}}
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注" v-if="showColumn.note"/>
          <el-table-column prop="create_time" label="创建时间" sortable v-if="showColumn.create_time"/>

        <!--操作栏-->
        <el-table-column label="操作" align="left" width="320">
          <template #default="scope">
            <el-button
                size="small"
                type="primary"
                @click="createReleaseConfig(scope.$index, scope.row)"
            >新建发布</el-button>
            <el-button
                size="small"
                type="info"
                @click="releaseConfig(scope.$index, scope.row)"
            >发布配置</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
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

  <AppEdit v-model:visible="editDialogVisible" :row="currentRow"></AppEdit>
  <AppCreate v-model:visible="createDialogVisible"></AppCreate>
  <CreateReleaseConfig v-model:visible="createConfigVisible" :rowId="rowId"></CreateReleaseConfig>
  <ReleaseConfig v-model:visible="releaseConfigVisible" :rowId="rowId"></ReleaseConfig>

</template>

<script>
    import AppEdit from './AppEdit';
    import AppCreate from "./AppCreate";
    import CreateReleaseConfig from "@/views/app/CreateReleaseConfig";
    import ReleaseConfig from "@/views/app/ReleaseConfig";
    export default {
        data() {
          return {
            tableData: [],
            currentPage: 1, // 默认开始页面
            pageSize: 10, // 默认每页的数据条数
            total: 0,  // 总数据条数
            urlParams: {   // URL查询参数，传递服务端，放这里方便修改值
              page_num: 1,
              page_size: this.pageSize,
              search: '',
            },
            editDialogVisible: false,  // 编辑对话框显示与隐藏
            currentRow: '',
            rowId: '',
            createDialogVisible: false, // 创建对话框显示与隐藏
            showColumn: {
              name: true,
              english_name: true,
              project: true,
              note: true,
              create_time: false
            },
            columnVisible: false,
            createConfigVisible: false,
            releaseConfigVisible: false
          }
        },
        mounted() {
          this.getData();
          // 从浏览器本地存储获取历史存储展示
          const columnSet = localStorage.getItem(this.$route.path + '-columnSet');
          if(columnSet) {
              this.showColumn = JSON.parse(columnSet)
          }
        },
        methods: {
          getData() {
            this.$http.get('/app_release/app/', {params: this.urlParams})
              .then(res => {
                this.tableData = res.data.data;
                this.total = res.data.count;
              })
          },
          // 分页：监听【选择每页数量】的事件
          handleSizeChange(pageSize) {
              // console.log(pageSize)
              this.pageSize = pageSize; // 重新设置分页显示
              this.urlParams.page_size = pageSize;  // 将最新值设置到数据里，用于下面用新值重新获取数据
              this.getData()
          },
          // 分页：监听【点击页码】的事件
          handleCurrentChange(currentPage) {
              // console.log(currentPage)
              this.currentPage = currentPage; // 重新设置分页显示
              this.urlParams.page_num = currentPage;
              this.getData()
          },
          // 操作栏：编辑显示
          handleEdit(index, row) {
              this.editDialogVisible = true;
              this.currentRow = row; // 传递给子组件当前行ID
          },
          // 操作栏：删除
          handleDelete(index, row) {
              console.log(index, row);
              this.$confirm("你确定要删除选中的吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                })
                .then(() => {  // 点击确定
                  this.$http.delete('/app_release/app/'+ row.id + '/')
                      .then(res => {
                        if(res.data.code === 200) {
                          this.$message.success('删除成功');
                          this.tableData.splice(index, 1); // 根据表格索引临时删除数据
                        }
                      });
                })
          },
          // 搜索按钮
          onSearch() {
            this.getData();
          },
          saveColumn() {
              // 将可显示的字段存储到浏览器本地存储
              localStorage.setItem(this.$route.path + '-columnSet', JSON.stringify(this.showColumn));
              this.columnVisible = false;
          },
          // 操作栏：新建配置
          createReleaseConfig(index, row) {
              this.rowId = row.id;
              this.createConfigVisible = true;
          },
          // 操作栏：发布配置
          releaseConfig(index, row) {
              this.rowId = row.id;
              this.releaseConfigVisible = true;
          }
        },
        components: {
          AppEdit,
          AppCreate,
          CreateReleaseConfig,
          ReleaseConfig,
        }
    }
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
    .search {
        width: 150px;
        margin-right: 10px;
    }
    .tools-right {
        display: flex;
    }

</style>