<template>
    <div class="s-table">
        <header class="m-10px" v-if="isShowHeader">
            <el-row class="justify-between">
                <div>
                    <slot name="LeftButton">
                        <el-button :icon="Plus" size="small" type="primary">添加</el-button>
                        <el-button :icon="Minus" size="small" type="danger">删除</el-button>
                    </slot>
                </div>
                <div class="flex items-center">
                    <slot name="RightButton">
                        <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
                            <s-icon class="m-r-10px cursor-pointer" icon="RefreshRight" @click="handleRefresh"></s-icon>
                        </el-tooltip>
                        <el-popover placement="bottom" :width="50" trigger="click">
                            <template #reference>
                                <s-icon class="m-r-10px cursor-pointer" icon="Operation"></s-icon>
                            </template>
                            <el-checkbox-group v-model="checkList">
                                <VueDraggable :animation="300" v-model="columnsAll">
                                    <el-checkbox :value="item.props.prop" :label="item.props.label"
                                        v-for="item in columnsAll" size="large" :key="item.props.prop" />
                                </VueDraggable>
                            </el-checkbox-group>
                        </el-popover>
                    </slot>
                </div>
            </el-row>
        </header>
        <aside>
            <el-table :data="tableData" v-bind="$attrs">
                <el-table-column v-for="(col, index) in visibleColumns"  :key="col.props.prop" v-bind="col.props">
                    <template #default="scope">
                        <slot :name="col.slotName || col.props.prop" v-bind="scope">
                            {{ scope.row[col.props.prop] }}
                        </slot>
                    </template>
                </el-table-column>
            </el-table>
        </aside>
        <footer class="m-t-10px " v-if="isShowFooter">
            <el-pagination class="justify-end" :current-page="currentPage" :page-size="pageSize" :page-sizes="pageSizes"
                :size="size" :disabled="disabled" :background="background"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue';
import type { ColumnProps, TableProps } from "@/layout/interface/componentsInterface";
import { VueDraggable } from 'vue-draggable-plus'

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

const columnsAll = ref<ColumnProps[]>([])

const checkList = ref<string[]>([])

// 计算属性：根据 checkList 过滤出需要显示的列，并保持 columnsAll 的排序
const visibleColumns = computed(() => {
    return columnsAll.value.filter(col => checkList.value.includes(col.props.prop))
})

// 初始化 checkList，只在 props.columns 变化时初始化一次
watch(() => props.columns, (newColumns) => {
    columnsAll.value = [...newColumns]
    checkList.value = newColumns.map(item => item.props.prop)
}, { immediate: true })



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
