<template>
    <div style="text-align: left">
        <el-dialog title="支払" :visible.sync="localDialogVisible" style="text-align: center;">
            <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                <div style="text-align: center;">
                    <el-form-item label="変更前金額:" style="display: inline-block;">
                        <el-input v-model="formLabelAlign.name" style="width: 50%;"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="変更後金額:">
                    <el-input v-model="formLabelAlign.region"></el-input>
                </el-form-item>
                <el-form-item label="支払方法:">
                    <el-input v-model="formLabelAlign.type"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Payment',
    props: {
        dialogTableVisible: Boolean,
        flag: Boolean
    },
    data() {
        return {
            localDialogVisible: this.dialogTableVisible,
            labelPosition: 'right',
            formLabelAlign: {
                name: '',
                region: '',
                type: ''
            }
        };
    },
    watch: {
        dialogTableVisible(newVal) {
            this.localDialogVisible = newVal;
        },
        localDialogVisible(newVal) {
            this.$emit('update:dialogTableVisible', newVal);
        },
    },
    methods: {
    }
};
</script>
