<template>
    <div class="s-table"> 
        <header class="m-b-10px" v-if="isShowHeader">
            <el-row class="justify-between">
                <div>
                    <slot name="LeftButton">
                        <el-button :icon="Plus" size="small" type="primary">添加</el-button>
                        <el-button :icon="Minus" size="small" type="danger">删除</el-button>
                    </slot>
                </div>
                <div class="flex items-center">
                   <s-icon icon="RefreshRight" @click="handleRefresh"></s-icon>
                </div>
            </el-row>
        </header>
        <aside>
            <el-table
                :data="tableData"
                v-bind="$attrs"
            >
                <el-table-column 
                    v-for="(col, index) in columns" 
                    :key="index"
                    v-bind="col.props"
                >
                    <template #default="scope">
                        <slot 
                            :name="col.slotName || col.props.prop" 
                            v-bind="scope"
                        >
                            {{ scope.row[col.props.prop] }}
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </aside>
        <footer class="m-t-10px " v-if="isShowFooter">
             <el-pagination
                class="justify-end"
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="pageSizes"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            ></el-pagination>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue';
import type { TableProps } from "@/interface/componentsInterface";


const props = withDefaults(defineProps<TableProps>(), {
    columns: () => [],
    tableData: () => [],
    currentPage: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 50, 100],
    total: 0,
    isShowHeader: true,
    isShowFooter: true,
    size: 'default',
    disabled: false,
    background: true,
});

const emit = defineEmits<{
    'update:currentPage': [value: number];
    'update:pageSize': [value: number];
    'size-change': [value: number];
    'current-change': [value: number];
    'refresh': [];
}>();

const handleSizeChange = (val: number) => {
    emit('update:pageSize', val);
    emit('size-change', val);
};

const handleCurrentChange = (val: number) => {
    emit('update:currentPage', val);
    emit('current-change', val);
};

const handleRefresh = () => {
    emit('refresh');
};
</script>

