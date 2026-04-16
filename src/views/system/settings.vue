<template>
    <div class="settings">
        <s-table :columns="(tableConfig.columns as any)" :table-data="tableConfig.tableData"
            :current-page="tableConfig.pagination.currentPage" :page-size="tableConfig.pagination.pageSize"
            :total="tableConfig.pagination.total" :isSelection="true" :calculateMaxHeight="{
                containerClass: 'layout-main',
                excludeClasses: []
            }" @refresh="handleRefresh" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            <!-- 自定义用户名列 -->
            <template #username="{ row }">
                <el-avatar :size="30" class="m-r-5px">{{ row.username.charAt(0) }}</el-avatar>
                <span>{{ row.username }}</span>
            </template>

            <!-- 自定义角色列 -->
            <template #role="{ row }">
                {{ row.role }}
            </template>

            <!-- 自定义状态列 -->
            <template #status="{ row }">
                {{ row.status === 1 ? '启用' : '禁用' }}
            </template>

            <!-- 自定义操作列 -->
            <template #action="{ row }">
                <s-button type="primary" size="small" @click="handleEdit(row)">编辑</s-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
            </template>
        </s-table>
    </div>
</template>

<script setup lang="ts">
import tableConfig from './tableData.json';

const handleRefresh = () => {
    console.log('刷新数据');
};

const handleSizeChange = (val: number) => {
    console.log('每页条数:', val);
};

const handleCurrentChange = (val: number) => {
    console.log('当前页:', val);
};

const handleEdit = (row: any) => {
    console.log('编辑:', row);
};

const handleDelete = (row: any) => {
    console.log('删除:', row);
};
</script>