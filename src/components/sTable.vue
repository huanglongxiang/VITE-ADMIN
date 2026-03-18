<template>
    <!-- 表格容器 -->
    <div class="s-table" ref="sTableRefMain">
        <!-- 表头区域：包含操作按钮 -->
         <header class="m-10px" v-if="isShowHeader">
            <el-row class="justify-between" :gutter="10">
                <!-- 左侧按钮区 -->
                <div class="flex-wrap gap-2 mb-2 md:mb-0">
                    <!-- 左插槽：可自定义按钮 -->
                    <slot name="LeftButton">
                        <el-button :icon="Plus" size="small" type="primary">添加</el-button>
                        <el-button :icon="Minus" size="small" type="danger" @click="handleDelete">删除</el-button>
                    </slot>
                </div>
                
                <!-- 右侧工具栏 -->
                <div class="flex items-center flex-wrap gap-2 justify-end">
                    <!-- 右插槽：可自定义工具按钮 -->
                    <slot name="RightButton">
                        <!-- 刷新按钮 -->
                        <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
                            <s-icon class="m-r-10px cursor-pointer" icon="RefreshRight" @click="handleRefresh"></s-icon>
                        </el-tooltip>
                        
                        <!-- 设置面板：边框、斑马线、多选 -->
                        <el-popover placement="bottom" :width="50" trigger="click">
                            <template #reference>
                                <s-icon class="m-r-10px cursor-pointer" icon="Setting"></s-icon>
                            </template>
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center justify-between">
                                    边框：<el-switch v-model="isBorder" />
                                </div>
                                <div class="flex items-center justify-between">
                                    斑马线：<el-switch v-model="isCrosswalk" />
                                </div>
                                <div class="flex items-center justify-between">
                                    多选：<el-switch v-model="isSelections" @change="handleSelectionSwitch" />
                                </div>
                            </div>
                        </el-popover>
                        
                        <!-- 列显示设置：可拖拽排序和勾选 -->
                        <el-popover placement="bottom" :width="200" trigger="click">
                            <template #reference>
                                <s-icon class="m-r-10px cursor-pointer" icon="Operation"></s-icon>
                            </template>
                            <el-checkbox-group v-model="checkList">
                                <VueDraggable :animation="300" v-model="columnsAll">
                                    <div class="flex flex-col gap-2 max-h-300px overflow-auto">
                                        <el-checkbox 
                                            :value="item.props.prop" 
                                            :label="item.props.label"
                                            v-for="item in columnsAll" 
                                            size="large" 
                                            :key="item.props.prop" 
                                        />
                                    </div>
                                </VueDraggable>
                            </el-checkbox-group>
                        </el-popover>
                    </slot>
                </div>
            </el-row>
        </header>
        
        <!-- 表格主体区域 -->
        <aside>
            <el-table 
                ref="sTableRef" 
                :data="tableData" 
                v-loading="tableLoading"
                v-bind="$attrs" 
                :border="isBorder" 
                :stripe="isCrosswalk"  
                :max-height="calculatedMaxHeightVal"
                @selection-change="handleSelectionChange"
            >
                <!-- 多选列 -->
                <template v-if="isSelections">
                    <el-table-column type="selection" width="55" />
                </template>
                
                <!-- 动态渲染列 -->
                <el-table-column 
                    v-for="(col, index) in visibleColumns"  
                    :key="col.props.prop" 
                    v-bind="col.props"
                >
                    <!-- 列内容插槽 -->
                    <template #default="scope">
                        <!-- 优先使用具名插槽，否则显示默认文本 -->
                        <slot :name="col.slotName || col.props.prop" v-bind="scope">
                            {{ scope.row[col.props.prop] }}
                        </slot>
                    </template>
                </el-table-column>
                <template v-if="isOptionaCal">
                    <el-table-column>
                        <template #default="scope">
                            <slot name="optionCol" v-bind="scope"></slot>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </aside>
        
        <!-- 分页区域 -->
        <footer class="m-t-10px " v-if="isShowFooter">
            <el-pagination 
                ref="paginationRef"
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
            >
            </el-pagination>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from '@element-plus/icons-vue';
import type { ColumnProps, TableProps } from "@/components/Interface/componentsInterface";
import { VueDraggable } from 'vue-draggable-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = withDefaults(defineProps<TableProps>(), {
    columns: () => [],              // 列配置数组
    tableData: () => [],            // 表格数据
    currentPage: 1,                 // 当前页码
    pageSize: 10,                   // 每页条数
    pageSizes: () => [10, 20, 50, 100],  // 每页条数选项
    total: 0,                       // 总条数
    isShowHeader: true,             // 是否显示表头
    isShowFooter: true,             // 是否显示分页
    size: 'default',                // 分页组件大小
    disabled: false,                // 是否禁用分页
    background: true,               // 是否显示分页背景色
    isOptionaCal:false,             // 是否显示操作列
    isSelection: false,             // 是否启用多选
    defaultSelections: () => [],    // 默认选中的行数据
});

const tableLoading = ref<boolean>(false)

// 所有列配置（用于拖拽排序）
const columnsAll = ref<ColumnProps[]>([])

// 选中的列名列表（用于控制列显示/隐藏）
const checkList = ref<string[]>([])

/**
 * 计算属性：可见列
 * 根据 checkList 过滤出需要显示的列，并保持 columnsAll 的排序
 */
const visibleColumns = computed(() => {
    nextTick(() => {
        // 重新布局，使列宽度正确
        sTableRef.value.doLayout();
    });
    return columnsAll.value.filter(col => checkList.value.includes(col.props.prop))
})

/**
 * 监听 props.columns 变化
 * 初始化 columnsAll 和 checkList
 * immediate: true 表示立即执行一次
 */
watch(() => props.columns, (newColumns) => {
    columnsAll.value = [...newColumns]  // 复制所有列配置
    checkList.value = newColumns.map(item => item.props.prop)  // 默认全选所有列
}, { immediate: true })

// 是否显示边框
const isBorder = ref(false)

// 是否显示斑马纹
const isCrosswalk = ref(false)

// 是否启用多选
const isSelections = ref(false)

// 存储当前选中的行数据
const selections = ref<any[]>([])

const emit = defineEmits<{
    'update:currentPage': [value: number];      // 更新当前页码
    'update:pageSize': [value: number];         // 更新每页条数
    'size-change': [value: number];             // 每页条数改变
    'current-change': [value: number];          // 页码改变
    'refresh': [];                               // 刷新事件
    'update:selections': [value: any[]];        // 更新选中行
    'delete':[value: any[]];                    // 删除事件
}>();

/**
 * 处理多选变化
 * 当用户勾选/取消勾选行时触发
 * @param val - 当前选中的行数组
 */
const handleSelectionChange = (val: any[]) => {
    selections.value = val
    if (isSelections) {
        emit('update:selections', val);
    }
}

// 表格组件引用
const sTableRef = ref<any>(null)

// 分页组件引用
const paginationRef = ref<any>(null)

/**
 * 处理多选开关切换
 * 关闭多选时清空已选数据
 */
const handleSelectionSwitch = () => {
    if (!isSelections) {
        sTableRef.value?.clearSelection()
        selections.value = []
    }
}

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
    sTableRef.value.setScrollTop(0)
    emit('update:pageSize', val);
    emit('size-change', val);
};

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
    sTableRef.value.setScrollTop(0)
    emit('update:currentPage', val);
    emit('current-change', val);
};

/**
 * 处理刷新
 * 触发表格重新加载数据
 */
const handleRefresh = () => {
    sTableRef.value.setScrollTop(0)
    emit('refresh');
};

/**
 * 处理删除选中行
 * 获取当前选中的行数据并执行删除操作
 */
const handleDelete = () => {
    if (!selections.value || selections.value.length === 0) {
        ElMessage.warning('请选择要删除的数据')
        return
    }
    
    ElMessageBox.confirm(
        `确定要删除选中的 ${selections.value.length} 条数据吗？`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        console.log('选中的行数据：', selections.value)
        emit('delete', selections.value)
        
        // 删除成功后清空选中状态
        sTableRef.value?.clearSelection()
        selections.value = []
        ElMessage.success('删除成功')
        emit('refresh')
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

/**
 * 根据默认选中值设置表格选中行
 * @param rows - 需要选中的行数据数组
 */
const setDefaultSelections = (rows: any[]) => {
    if (!rows || rows.length === 0) return
    
    nextTick(() => {
        rows.forEach(row => {
            sTableRef.value?.toggleRowSelection(row, true)
        })
    })
}

/**
 * 监听 defaultSelections 变化，自动设置选中
 */
watch(() => props.defaultSelections, (newVal) => {
    if (newVal && newVal.length > 0 && isSelections.value) {
        setDefaultSelections(newVal)
    }
}, { immediate: true })

/**
 * 监听 isSelection 变化，同步到 isSelections
 */
watch(() => props.isSelection, (newVal) => {
    if (newVal) {
        isSelections.value = newVal
    }
}, { immediate: true })

watch(() => isSelections.value, (newVal) => {
    nextTick(() => {
        sTableRef.value.doLayout();
    })
})

/**
 * 计算表格最大高度
 * 公式：容器高度 - 其他元素总高度 = 表格最大高度
 */
const calculatedMaxHeightVal = ref<string|number>('auto')
const sTableRefMain = ref<HTMLElement>()
const calculateMaxHeight = () => {
  if (!props.calculateMaxHeight?.containerClass) return
  
  // 获取容器元素
  const container = document.querySelector(`.${props.calculateMaxHeight?.containerClass}`)
  if (!container) return
  
  const containerHeight = container.getBoundingClientRect().height
  console.log(containerHeight)
  
  // 计算需要排除的元素总高度
  let excludeTotalHeight = 0
  if (props.calculateMaxHeight?.excludeClasses && props.calculateMaxHeight?.excludeClasses.length > 0) {
    props.calculateMaxHeight?.excludeClasses.forEach(className => {
      const elements = document.querySelectorAll(`.${className}`)
      elements.forEach(element => {
        excludeTotalHeight += element.getBoundingClientRect().height
      })
    })
  }
  
  // 计算组件内部元素高度（头部 + 分页器）
  let internalHeight = 0
  const headerElement = sTableRefMain.value?.querySelector('header')
  const footerElement = sTableRefMain.value?.querySelector('footer')
   
  if (headerElement && props.isShowHeader) {
    
    internalHeight += headerElement.getBoundingClientRect().height
    console.log(internalHeight)
  }
  
  if (footerElement && props.isShowFooter) {
    internalHeight += footerElement.getBoundingClientRect().height
    console.log(footerElement.getBoundingClientRect().height)
  }
  
  // 计算表格最大高度（可以预留一些缓冲空间，比如 20px）
  calculatedMaxHeightVal.value = (containerHeight - excludeTotalHeight - internalHeight - 32) as number
  console.log(calculatedMaxHeightVal.value)

}

onMounted(() => {
    if(props.isSelection){
        isSelections.value = props.isSelection
        if (props.defaultSelections && props.defaultSelections.length > 0) {
            setDefaultSelections(props.defaultSelections)
        }
    }
    if(props.calculateMaxHeight && Object.keys(props.calculateMaxHeight)){
        calculateMaxHeight();
        // 监听窗口大小变化，重新计算高度
        window.addEventListener('resize', calculateMaxHeight)
    }
});

// 如果需要清理监听器
onUnmounted(() => {
    if(props.calculateMaxHeight && Object.keys(props.calculateMaxHeight)){
        window.removeEventListener('resize', calculateMaxHeight)
    }
});

// 暴露组件实例方法给父组件
defineExpose({
    /** 表格组件实例 */
    tableInstance: sTableRef,
    /** 分页器实例 */
    paginationInstance: paginationRef,
    /** 获取选中的行数据 */
    getSelectionRows: () => selections.value,
    /** 清空选中状态 */
    clearSelection: () => {
        sTableRef.value?.clearSelection()
        selections.value = []
    },
    /** 设置选中行 */
    toggleRowSelection: (row: any, selected?: boolean) => {
        sTableRef.value?.toggleRowSelection(row, selected)
    },
    /** 设置默认选中 */
    setDefaultSelections,
    // 获取表格加载状态
    tableLoading,
})

</script>