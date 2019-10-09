<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="addMenu">添加</el-button>

                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </div>
            <el-table :data="tableData"
                      row-key="id"
                      default-expand-all
                      border
                      class="table"
                      ref="multipleTable"
                      @selection-change="handleSelectionChange"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>


                <el-table-column prop="menuName" label="菜单名" width="120">
                </el-table-column>
                <el-table-column prop="parentId" label="上级菜单" width="120">
                </el-table-column>

                <el-table-column prop="gmtCreate" label="创建时间" sortable width="250">
                </el-table-column>
                <el-table-column prop="address" label="地址" width="300">
                </el-table-column>
                <el-table-column prop="path" label="深度" width="100">
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row,1)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                               :total="1000">
                </el-pagination>
            </div>
        </div>

        <!-- 弹出框 -->
        <el-dialog :title="bouncedItem" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">

                <el-form-item label="菜单名">
                    <el-input v-model="form.menuName"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" name="address"></el-input>
                </el-form-item>
                <el-form-item label="创建日期">
                    <el-date-picker type="date" placeholder="选择日期"  v-model="form.gmtCreate" name="gmtCreate"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="上级菜单">
                    <el-cascader
                            v-model="value"
                            :options="options"
                            :props="{ expandTrigger: '' }"
                            @change="handleChange"
                            style="width: 100%;"></el-cascader>
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
    import {getMenuTree} from '../../api/sys/menu';

    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                options: [],
                bouncedItem: '',
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    menuName: '',
                    gmtCreate: '',
                    parentId: '',
                    address: ''
                },
                idx: -1,
                id: -1
            }
        },
        created() {
            this.getData();
        },
        computed: {
            // data() {
            //     return this.tableData.filter((d) => {
            //         let is_del = false;
            //         for (let i = 0; i < this.del_list.length; i++) {
            //             if (d.name === this.del_list[i].name) {
            //                 is_del = true;
            //                 break;
            //             }
            //         }
            //         if (!is_del) {
            //             if (d.address.indexOf(this.select_cate) > -1 &&
            //                 (d.name.indexOf(this.select_word) > -1 ||
            //                     d.address.indexOf(this.select_word) > -1)
            //             ) {
            //                 return d;
            //             }
            //         }
            //     })
            // }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {

                getMenuTree().then((res) => {
                    if (res.status === 0) {
                        console.log(res.data)
                        this.tableData = res.data;
                        this.options = res.data;
                    } else {
                        this.$notify.error({
                            // title: '错误',
                            message: res.message
                        });
                    }

                })

            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },

            // 编辑
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                this.form = {
                    id: row.id,
                    menuName: row.menuName,
                    gmtCreate: row.gmtCreate,
                    address: row.address,
                    value: row.menuName,
                }
                this.bouncedItem = "菜单编辑"
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                this.delVisible = true;
            },
            // delAll() {
            //     const length = this.multipleSelection.length;
            //     let str = '';
            //     this.del_list = this.del_list.concat(this.multipleSelection);
            //     for (let i = 0; i < length; i++) {
            //         str += this.multipleSelection[i].name + ' ';
            //     }
            //     this.$message.error('删除了' + str);
            //     this.multipleSelection = [];
            // },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit(system, params) {
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                if (this.tableData[this.idx].id === this.id) {
                    this.$set(this.tableData, this.idx, this.form);
                } else {
                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].id === this.id) {
                            this.$set(this.tableData, i, this.form);
                            return;
                        }
                    }
                }
            },
            // 确定删除
            deleteRow() {
                this.$message.success('删除成功');
                this.delVisible = false;
                if (this.tableData[this.idx].id === this.id) {
                    this.tableData.splice(this.idx, 1);
                } else {
                    for (let i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].id === this.id) {
                            this.tableData.splice(i, 1);
                            return;
                        }
                    }
                }
            },
            addMenu() {
                this.bouncedItem = "创建菜单";
                this.editVisible = true;
                this.form = {
                    id: '',
                    menuName: '',
                    gmtCreate: '',
                    address: '',
                    value: '',
                }


            },
            // 级联菜单发生变化
            handleChange(value) {
                console.log(value);
            }


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
