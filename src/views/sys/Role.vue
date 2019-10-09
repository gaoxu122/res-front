<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-add" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" class="handle-del mr10" @click="addRole">添加</el-button>
                <el-input v-model="select_word" placeholder="角色名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名" width="100">
                </el-table-column>
                <el-table-column prop="email" label="创建用户" width="200">
                </el-table-column>
                <el-table-column prop="gmtCreate" label="创建日期" sortable width="250">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                    <el-tag size="medium">{{isEnable}}</el-tag>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">

                <el-form-item label="角色名称">
                    <el-input v-model="form.roleName" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱">
                    <el-input v-model="form.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="form.tel" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.value" placeholder="请选择" style="width: 100%">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getRole, insertRole, updateRole} from '../../api/sys/role';

    export default {
        name: 'basetable',
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
                options: [{
                    value: true,
                    label: '启用'
                }, {
                    value: false,
                    label: '禁用'
                }],
                idx: -1,
                id: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {},
        methods: {

            //刷新
            refresh() {
                this.getData()
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData(parem) {

                console.log(parem);
                if (typeof (parem) == "undefined") {
                    parem = {page: this.cur_page}
                }

                getRole(parem).then((res) => {
                    console.log(res.data.total);
                    console.log(res.status);
                    if (res.status === 0) {
                        this.tableData = res.data.data;
                        this.total = res.data.total;
                        this.isEnable = res.data.isEnable ? '启用' : '禁用';
                    } else {
                        this.$notify.error({
                            // title: '错误',
                            message: res.message
                        });
                    }
                })
            },
            // 查询
            search() {
                this.is_search = true;
                console.log(this.select_word);
                const parem = {
                    page: this.cur_page,
                    userName: this.select_word
                }
                this.getData(parem);
            },

            // 编辑
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                this.form = {
                    id: row.id,
                    userName: row.userName,
                    email: row.email,
                    gmtCreate: row.gmtCreate,
                    tel: row.tel,
                    value: row.isEnable ? '启用' : '禁用',
                }
                this.editVisible = true;
            },
            // 删除
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },

            // 批量删除
            delAll() {

                console.log(this.multipleSelection);
                const length = this.multipleSelection.length;
                let str = '';
                // this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].id + ',';
                }

                batchDeleteUser({ids: str}).then((res) => {
                    if (res.status === 0) {
                        this.$message.error('删除了' + str);
                        this.refresh();
                    } else {
                        this.$message.error('删除失敗')
                    }
                });

                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                // console.log(val);
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(form) {

                // alert(this.form.value)
                const param = {
                    id: this.form.id,
                    userName: this.form.userName,
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
            // 确定删除
            deleteRow() {
                // this.$message.success('删除成功');
                this.delVisible = false;
                deleteUser({id: this.id}).then((res) => {
                    if (res.status === 0) {
                        this.$message.success(`删除成功`);
                        this.refresh();
                    }
                });
            },

            addRole(form) {

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


        }
    }

</script>

<style scoped>
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
