<script setup>
const { tabs, activeTab } = defineProps(["tabs", "activeTab"]);
const emit = defineEmits(["setActiveTab"]);

const emitItemToParent = (item) => {
  emit("setActiveTab", item);
};
</script>

<template>
  <div class="border-b-2 border-b-[#EDF2F7] dark:border-b-neutral-700 h-[47px]">
    <div class="flex gap-5">
      <div v-for="(item, index) in tabs" :key="index">
        <div
          class="text-[15px] dark:neutral-50 px-2 py-1 hover:bg-[#E7F7EF] dark:hover:bg-neutral-800 rounded-sm cursor-pointer"
          :class="{
            'text-primary': item == activeTab,
            'text-[#797B89]': item !== activeTab,
          }"
          @click="emitItemToParent(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div
      class="border-t-2 border-t-solid border-t-primary mt-3 transition-all"
      :class="{
        'w-[37px]': activeTab == 'All',
        'w-[49px] translate-x-[53px]': activeTab == 'Paid',
        'w-[68px] translate-x-[118px]': activeTab == 'Unpaid',
        'w-[78px] translate-x-[202px]': activeTab == 'Overdue',
      }"
    />
  </div>
</template>
