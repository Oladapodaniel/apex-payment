<script setup>
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import { Separator } from "@/components/ui/separator";
import { capitalizeFirstLetter, getCurrencySymbol } from "../lib/utils";
import dateFormatter from "../lib/moment";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const { paymentHeaders, paymentData, list } = defineProps([
  "paymentHeaders",
  "paymentData",
  "list",
]);
const emit = defineEmits(["numperpage", "setpage", "selecteditems"]);

const num_per_page = ref(paymentData?.per_page.toString());
const pages = ref([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
const selectedPaymentItems = ref([]);

watch(num_per_page, (newValue, oldValue) => {
  if (newValue) {
    emit("numperpage", newValue);
  }
});

const emitPage = (page, type) => {
  if (type == "previous") {
    emit("setpage", { type: "previous", value: page });
  } else if (type == "next") {
    emit("setpage", { type: "next", value: page });
  } else {
    emit("setpage", { type: "default", value: page });
  }
};

const selectItem = (item) => {
  if (selectedPaymentItems.value.length > 0) {
    const findIfItemExist = selectedPaymentItems.value.findIndex((i) => i.id === item.id);
    if (findIfItemExist < 0) {
      selectedPaymentItems.value.push(item);
    } else {
      selectedPaymentItems.value = selectedPaymentItems.value.filter(
        (i) => i.id !== item.id
      );
    }
  } else {
    selectedPaymentItems.value.push(item);
  }
  emit("selecteditems", selectedPaymentItems.value);
};
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow
        class="border-[#EEEFF2] dark:border-neutral-700 dark:hover:bg-[#9a9a9a0f]"
      >
        <TableHead></TableHead>
        <TableHead
          v-for="(item, index) in paymentHeaders"
          :key="index"
          class="text-[#718096] dark:text-neutral-300 general-sans-medium"
        >
          {{ item }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="(item, index) in list"
        :key="index"
        class="dark:hover:bg-[#9a9a9a0f] border-[#EEEFF2] dark:border-neutral-700"
      >
        <TableCell class="font-medium">
          <Checkbox
            :id="index.toString()"
            @click="selectItem(item)"
            class="border-neutral-300 dark:border-neutral-500 dark:data-[state=checked]:bg-neutral-600 dark:data-[state=checked]:border-neutral-600 rounded-full w-[20px] h-[20px] data-[state=checked]:border-primary"
          />
        </TableCell>
        <TableCell class="py-0">
          <div class="general-sans-semibold text-[#111827] dark:text-neutral-50">
            {{ item?.user?.name }}
          </div>
          <div class="text-[#88888A] general-sans-medium mt-1">
            {{ item?.user?.email }}
          </div>
        </TableCell>
        <TableCell class="font-medium py-2">
          <div>
            <Button
              class="bg-[#E7F7EF] dark:bg-neutral-700 text-primary text-[14px] dark:text-neutral-50 border-0 dark:border-0 rounded-[8px] h-[32px] general-sans-medium"
              :class="{
                'text-[#FE964A] bg-[#FFF0E6]':
                  item?.user?.status.toLowerCase() === 'inactive',
              }"
            >
              <Icon
                icon="radix-icons:dot-filled"
                class="rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                :class="{
                  'bg-[#FE964A]': item.user.status.toLowerCase() === 'inactive',
                  'bg-primary ': item.user.status.toLowerCase() === 'active',
                }"
              />
              {{ capitalizeFirstLetter(item?.user?.status) }}
            </Button>
          </div>
          <div class="text-[#383A47] dark:text-neutral-50 general-sans-medium mt-1">
            Last Login: {{ dateFormatter.monthDayYear(item?.user?.last_login_at) }}
          </div>
        </TableCell>
        <TableCell class="font-medium py-0">
          <div>
            <Button
              class="bg-[#E7F7EF] dark:bg-neutral-700 text-primary text-[14px] dark:text-neutral-50 border-0 dark:border-0 rounded-[8px] h-[32px] general-sans-medium"
              :class="{
                'text-[#D4A701] bg-[#FEF7DC]':
                  item.payment_status.toLowerCase() === 'unpaid',
                'text-[#8C62FF] bg-[#F4F0FF]':
                  item.payment_status.toLowerCase() === 'paid',
                'text-[#FD6A6A] bg-[#FEEFEF]':
                  item.payment_status.toLowerCase() === 'overdue',
              }"
            >
              <Icon
                icon="radix-icons:dot-filled"
                class="rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                :class="{
                  'bg-[#D4A701]': item?.payment_status.toLowerCase() === 'unpaid',
                  'bg-[#8C62FF]': item?.payment_status.toLowerCase() === 'paid',
                  'bg-[#FD6A6A]': item?.payment_status.toLowerCase() === 'overdue',
                }"
              />
              {{ item?.payment_status }}
            </Button>
          </div>
          <div class="text-[#383A47] dark:text-neutral-50 general-sans-medium mt-1">
            {{
              item?.payment_status.toLowerCase() === "paid"
                ? `Paid on: ${dateFormatter.monthDayYear(item.payment_made_at)}`
                : item?.payment_status.toLowerCase() === "unpaid"
                ? `Dues on: ${dateFormatter.monthDayYear(item.payment_expected_at)}`
                : `Dued on: ${dateFormatter.monthDayYear(item.payment_expected_at)}`
            }}
          </div>
        </TableCell>
        <TableCell class="font-medium py-0">
          <div class="general-sans-semibold text-[#111827] dark:text-neutral-50">
            {{ getCurrencySymbol(item.currency) }}{{ item.amount.toLocaleString() }}
          </div>
          <div class="general-sans-medium text-[#88888A]">{{ item.currency }}</div>
        </TableCell>
        <TableCell class="font-medium py-0">
          <Button variant="outline" size="icon">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="outline"
                  class="text-[#A0AEC0] hover:text-[#A0AEC0] dark:text-neutral-50 border-0 dark:bg-neutral-700"
                >
                  <Icon
                    icon="radix-icons:dots-horizontal"
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                class="border-0 shadow-[0px_5px_15px_0px_#00000033] dark:bg-neutral-800"
              >
                <DropdownMenuItem class="focus:bg-[#E7F7EF] dark:focus:bg-neutral-700">
                  <div class="text-[#383A47] dark:text-neutral-300 general-sans-medium">
                    Edit
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem class="focus:bg-[#E7F7EF] dark:focus:bg-neutral-700">
                  <div class="text-[#383A47] dark:text-neutral-300 general-sans-medium">
                    View Profile
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="focus:bg-[#E7F7EF] dark:focus:bg-neutral-700">
                  <div class="text-[#D30000] dark:text-neutral-300 general-sans-medium">
                    Delete
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <Separator class="mb-4 bg-[#EEEFF2] dark:bg-neutral-700" />
  <!-- Pagination -->
  <div class="flex flex-col md:flex-row md:justify-between items-center px-5 py-5 pb-10">
    <div class="flex items-center mb-5 md:mb-0">
      <div
        class="text-[#718096] dark:text-neutral-200 general-sans-medium text-[14px] w-[90px]"
      >
        Show result
      </div>
      <Select v-model="num_per_page">
        <SelectTrigger
          class="mt-2 h-[40px] w-0 min-w-16 dark:bg-neutral-800 border dark:border dark:border-solid dark:border-neutral-600"
        >
          <SelectValue placeholder="1" class="general-sans-medium general-sans-bold" />
        </SelectTrigger>
        <SelectContent
          class="dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
        >
          <SelectItem
            class="general-sans-medium dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            :value="item.toString()"
            v-for="(item, index) in pages"
            :key="index"
            >{{ item }}</SelectItem
          >
        </SelectContent>
      </Select>
    </div>
    <Pagination
      v-slot="{ page }"
      :total="paymentData.total"
      :sibling-count="1"
      show-edges
      :default-page="paymentData.current_page"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationPrev
          @click="emitPage(page, 'previous')"
          class="border-0 text-[#A0AEC0] hover:bg-[#E7F7EF] dark:bg-neutral-700 dark:hover:bg-neutral-600 hover:text-[#A0AEC0] rounded-[12px]"
        />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
            @click="emitPage(item.value, 'default')"
          >
            <Button
              class="w-10 h-10 p-0 text-[#A0AEC0] general-sans-medium bg-[#E7F7EF] hover:bg-[#E7F7EF] rounded-[12px] dark:bg-neutral-700 dark:hover:bg-neutral-600"
              :class="{
                'general-sans-bold text-primary dark:text-neutral-50':
                  item.value === page,
                'bg-white': item.value !== page,
              }"
              variant="default"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis
            v-else
            :key="item.type"
            :index="index"
            class="text-[#A0AEC0] self-end"
          />
        </template>

        <PaginationNext
          @click="emitPage(page, 'next')"
          class="border-0 text-[#A0AEC0] dark:bg-neutral-700 dark:hover:bg-neutral-600 hover:bg-[#E7F7EF] hover:text-[#A0AEC0] rounded-[12px]"
        />
      </PaginationList>
    </Pagination>
  </div>
</template>
