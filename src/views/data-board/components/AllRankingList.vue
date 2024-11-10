<template>
  <el-dialog title="附件列表" :visible.sync="visible" class="dialog-container" width="460px">
    <el-table :cell-style="{ padding: '6px' }" :data='data' height="400">
      <el-table-column label="排名" width="100">
        <template slot-scope="scope">
          <span v-if="scope.$index + 1 == 1"><img :src="gainIcon('no_1')" /></span>
          <span v-else-if="scope.$index + 1 == 2"><img :src="gainIcon('no_2')" /></span>
          <span v-else-if="scope.$index + 1 == 3"><img :src="gainIcon('no_3')" /></span>
          <span v-else>{{ scope.$index + 1 }} </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="姓名" prop="demander"></el-table-column>
      <el-table-column label="消耗小时数">
        <template slot-scope="{row}">
          {{ row.personalTotalCostHours | hours(row.personalTotalCostHours) }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {};
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    }
  },
  methods: {
    gainIcon(btn) {
      return require(`@/assets/btn_icons/${btn}.png`);
    }
  }
};
</script>
