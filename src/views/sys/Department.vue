<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-rank"></i>部门人员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="drag-box">
                <div class="drag-box-item">
                    <div class="item-title">部门列表</div>
                    <div class="drag-box">
                        <el-input v-model="select_word" placeholder="部门名称" class="handle-input mr10"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        <el-button type="primary" class="handle-del mr10" @click="addDepartment">添加部门</el-button>
                    </div>
                    <div>
                        <el-tree
                                :data="data"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                            <el-button type="text" size="mini" @click="() => append(data)"> 编辑 </el-button>
                            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                            </span>
                            </span>
                        </el-tree>
                    </div>

                </div>
                <div class="drag-box-item1">
                    <div class="item-title">人员列表</div>
                    <div class="container">
                        <div class="handle-box">
                            <!--<el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                            <el-input v-model="select_word" placeholder="用户名" class="handle-input mr10"></el-input>
                            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        </div>
                        <el-table :data="tableData" border class="table" ref="multipleTable"
                                  @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column prop="userName" label="姓名" width="100">
                            </el-table-column>
                            <el-table-column prop="email" label="邮箱" width="200">
                            </el-table-column>
                            <el-table-column prop="tel" label="电话号码" width="180">
                            </el-table-column>
                            <el-table-column prop="gmtCreate" label="创建日期" sortable width="250">
                            </el-table-column>
                            <el-table-column prop="status" label="状态" width="80">
                                <!--<el-tag size="medium">{{isEnable}}</el-tag>-->
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="top">
                                        <p>状态: {{ scope.row.isEnable ? "启用" :"禁用" }}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium">{{ scope.row.isEnable ? "启用" :"禁用"}}</el-tag>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="300" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit"
                                               @click="handleEdit(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red"
                                               @click="handleDelete(scope.$index, scope.row)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                    @current-change="handleCurrentChange"
                                    :current-page.sync="currentPage1"
                                    :page-size="10"
                                    layout="total, prev, pager, next"
                                    :total="total">
                            </el-pagination>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: 'department',
        data() {
            return {
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                currentPage1: 1,
                total: '',
                PopUpBox: '',
                isEnable: '',
                value: '',
                form: {
                    id: '',
                    userName: '',
                    gmtCreate: '',
                    sex: '',
                    email: '',
                    tel: ''
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                todo: [
                    {
                        id: 1,
                        content: '开发图表组件'
                    },
                    {
                        id: 2,
                        content: '开发拖拽组件'
                    },
                    {
                        id: 3,
                        content: '开发权限测试组件'
                    }
                ],
                doing: [
                    {
                        id: 1,
                        content: '开发登录注册页面'
                    },
                    {
                        id: 2,
                        content: '开发头部组件'
                    },
                    {
                        id: 3,
                        content: '开发表格相关组件'
                    },
                    {
                        id: 4,
                        content: '开发表单相关组件'
                    }
                ],
                done: [
                    {
                        id: 1,
                        content: '初始化项目，生成工程目录，完成相关配置'
                    },
                    {
                        id: 2,
                        content: '开发项目整体框架'
                    }
                ]
            }
        },
        components: {
            draggable
        },
        methods: {

            addDepartment() {

                // alert(this.form.value)
                const param = {
                    roleName: this.form.roleName,
                    email: this.form.email,
                    tel: this.form.tel,
                    isEnable: this.form.value
                }
                updateUser(param).then((res) => {
                    if (res.status === 0) {
                        this.$message.success(`修改成功`);
                        this.editVisible = false;
                        this.refresh();
                    }
                })
            },
            removeHandle(event) {
                console.log(event);
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            }
        }
    }

</script>

<style scoped>
    .drag-box {
        display: flex;
        user-select: none;
    }

    .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
    //background-color: #eff1f5; margin-right: 10px; border-radius: 6px; border: 1px #e1e4e8 solid;
    }

    .drag-box-item1 {
        flex: 1;
        max-width: 100%;
        min-width: 300px;
    //background-color: #eff1f5; margin-right: 10px; border-radius: 6px; border: 1px #e1e4e8 solid;
    }

    .item-title {
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

    .item-ul {
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }

    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .ghost-style {
        display: block;
        color: transparent;
        border-style: dashed
    }

    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {

        margin-right: 10px;

    }
</style>
