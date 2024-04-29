<script setup>
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/vue";
import DataTable from "./DataTable.vue";
import Header from "./Header.vue";
import Tabs from "./Tabs.vue";
import { getPayments, makePayment } from "../services";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { updatePayments } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const count = ref(0);
const tabs = ["All", "Paid", "Unpaid", "Overdue"];
const activeTab = ref("All");
const paymentHeaders = ref(["Name", "User Status", "Payment Status", "Amount", ""]);
const isOpen = ref(false);
const paymentData = ref([]);
const loading = ref(false);
const payDueLoading = ref(false);
const name = ref("");
const amount = ref("");
const userStatus = ref("");
const paymentStatus = ref("");
const selectedPayments = ref([]);

const setActiveTab = (payload) => {
  activeTab.value = payload;
  getPaymentsData();
};

const payDues = async () => {
  // Make payments
  if (selectedPayments.value.length === 0) {
    toast(
      "Select the due you want to pay for by checking the box beside each items on the list below.",
      {
        autoClose: 8000,
      }
    );
    return;
  }
  payDueLoading.value = true;
  let payload = {
    payments: selectedPayments.value.map((i) => i.id),
  };
  try {
    let { data } = await makePayment(payload);
    toast("Payment successful  🎉", {
      autoClose: 3000,
    });
    payDueLoading.value = false;

    // Update the payment details in the view
    paymentData.value = {
      ...paymentData.value,
      data: updatePayments(paymentData.value.data, data.data).map((i) => {
        if (!i.payment_made_at && new Date() < new Date(i.payment_expected_at)) {
          i.payment_status = "Unpaid";
        } else if (!i.payment_made_at && new Date() > new Date(i.payment_expected_at)) {
          i.payment_status = "Overdue";
        } else {
          i.payment_status = "Paid";
        }
        return i;
      }),
    };
  } catch (error) {
    payDueLoading.value = false;
    if (error?.response) {
      toast(error?.response?.data?.message, {
        autoClose: 3000,
      });
    }
  }
};

const getPaymentsData = async (num_per_page, page) => {
  // Get all payments transactions
  loading.value = true;
  try {
    let { data } = await getPayments(
      activeTab.value,
      num_per_page ? num_per_page : "20",
      page ? page : "1"
    );

    paymentData.value = {
      ...data,
      data: data.data.map((i) => {
        if (!i.payment_made_at && new Date() < new Date(i.payment_expected_at)) {
          i.payment_status = "Unpaid";
        } else if (!i.payment_made_at && new Date() > new Date(i.payment_expected_at)) {
          i.payment_status = "Overdue";
        } else {
          i.payment_status = "Paid";
        }
        return i;
      }),
    };
    loading.value = false;
  } catch (error) {
    loading.value = false;
    if (error?.response) {
      toast(error?.response?.data?.message, {
        autoClose: 3000,
      });
    }
  }
};
getPaymentsData();

const filterPaymentTransactions = computed(() => {
  // Computations for the filter feature
  let transactions = paymentData.value.data;

  if (name.value) {
    transactions = transactions.filter((i) =>
      i?.user?.name?.toLowerCase().includes(name.value.toLowerCase())
    );
  }

  if (amount.value) {
    transactions = transactions.filter((i) =>
      i?.amount.toString().toLowerCase().includes(amount.value.toLowerCase())
    );
  }

  if (userStatus.value) {
    transactions = transactions.filter((i) => {
      if (userStatus.value === "all") return true;
      return i?.user?.status?.toString().toLowerCase() === userStatus.value.toLowerCase();
    });
  }

  if (paymentStatus.value) {
    transactions = transactions.filter((i) => {
      if (paymentStatus.value === "all") return true;
      return (
        i?.payment_status?.toString().toLowerCase() === paymentStatus.value.toLowerCase()
      );
    });
  }
  return transactions;
});

const getPaymentsByNumOfPage = (payload) => {
  getPaymentsData(payload, paymentData.value.current_page);
};

const getPaymentsByPage = ({ type, value }) => {
  if (type == "previous") getPaymentsData(paymentData.value.per_page, value - 1);
  if (type == "next") getPaymentsData(paymentData.value.per_page, value + 1);
  if (type == "default") getPaymentsData(paymentData.value.per_page, value);
};

const setSelectedItems = (payload) => {
  selectedPayments.value = payload;
};
</script>

<template>
  <div class="bg-[#FAFAFA] dark:bg-neutral-900 pb-10">
    <!-- Header -->
    <Header />
    <div class="px-5 md:px-10">
      <div class="grid md:grid-cols-2 mt-8">
        <!-- Tabs -->
        <Tabs :tabs="tabs" :activeTab="activeTab" @setActiveTab="setActiveTab" />
        <div class="flex justify-center mt-3 md:mt-0 md:justify-end">
          <Button
            class="w-[254px] bg-primary text-[16px] rounded-[12px] hover:bg-[#53b586] h-100 general-sans-bold"
            @click="payDues"
            :disabled="payDueLoading"
          >
            <div class="animate-spin h-[1.2rem] w-[1.2rem] mr-2" v-if="payDueLoading">
              <Icon
                icon="radix-icons:update"
                class="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0 dark:scale-100"
              />
            </div>
            Pay Dues</Button
          >
        </div>
      </div>

      <!-- Filter Table -->
      <div class="mt-5 bg-[#FFFFFF] dark:bg-neutral-800 rounded-[16px]">
        <div class="p-5 md:p-10">
          <Collapsible v-model:open="isOpen">
            <CollapsibleTrigger class="flex w-[100%] justify-end">
              <div>
                <Button
                  class="bg-[#FAFAFA] dark:bg-neutral-700 text-primary text-[16px] dark:text-neutral-50 border border-solid border-[#EEEFF2] dark:border-0 rounded-[12px] hover:bg-[#E7F7EF] dark:hover:bg-neutral-600 h-100 general-sans-medium"
                >
                  <Icon
                    icon="radix-icons:mixer-horizontal"
                    class="mr-2 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all"
                  />
                  Filters
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="grid sm:grid-cols-2 md:grid-cols-4 mt-8 gap-x-3 p-2">
                <div>
                  <h2 class="general-sans-bold mt-3 md:mt-0 sm:text-left">Name</h2>
                  <Input
                    type="text"
                    placeholder="name"
                    v-model="name"
                    class="mt-2 bg-[#FAFAFA] dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
                  />
                </div>
                <div>
                  <h2 class="general-sans-bold mt-3 md:mt-0 sm:text-left">Amount</h2>
                  <Input
                    type="text"
                    placeholder="amount"
                    v-model="amount"
                    class="mt-2 bg-[#FAFAFA] dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
                  />
                </div>
                <div>
                  <h2 class="general-sans-bold mt-3 md:mt-0 sm:text-left">
                    User's status
                  </h2>
                  <Select v-model="userStatus">
                    <SelectTrigger
                      class="mt-2 h-[40px] bg-[#FAFAFA] dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
                    >
                      <SelectValue
                        placeholder="user's status"
                        class="general-sans-medium"
                      />
                    </SelectTrigger>
                    <SelectContent
                      class="dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
                    >
                      <SelectItem
                        class="general-sans-medium dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="all"
                        >All</SelectItem
                      >
                      <SelectItem
                        class="general-sans-medium text-primary focus:text-primary dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="active"
                      >
                        <div class="flex items-center">
                          <Icon
                            icon="radix-icons:dot-filled"
                            class="bg-primary rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                          />
                          <div>Active</div>
                        </div>
                      </SelectItem>
                      <SelectItem
                        class="general-sans-medium text-[#FE964A] focus:text-[#FE964A] dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="inactive"
                      >
                        <div class="flex items-center">
                          <Icon
                            icon="radix-icons:dot-filled"
                            class="bg-[#FE964A] rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                          />
                          <div>Inactive</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h2 class="general-sans-bold mt-3 md:mt-0 sm:text-left">
                    Payment status
                  </h2>
                  <Select v-model="paymentStatus">
                    <SelectTrigger
                      class="mt-2 h-[40px] bg-[#FAFAFA] dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
                    >
                      <SelectValue
                        placeholder="payment status"
                        class="general-sans-medium"
                      />
                    </SelectTrigger>
                    <SelectContent
                      class="dark:bg-neutral-800 border-0 dark:border dark:border-solid dark:border-neutral-600"
                    >
                      <SelectItem
                        class="general-sans-medium dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="all"
                        >All</SelectItem
                      >
                      <SelectItem
                        class="general-sans-medium text-[#8C62FF] focus:text-[#8C62FF] dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="paid"
                      >
                        <div class="flex items-center">
                          <Icon
                            icon="radix-icons:dot-filled"
                            class="bg-[#8C62FF] rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                          />
                          <div>Paid</div>
                        </div>
                      </SelectItem>
                      <SelectItem
                        class="general-sans-medium text-[#D4A701] focus:text-[#D4A701] dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="unpaid"
                      >
                        <div class="flex items-center">
                          <Icon
                            icon="radix-icons:dot-filled"
                            class="bg-[#D4A701] rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                          />
                          <div>Unpaid</div>
                        </div>
                      </SelectItem>
                      <SelectItem
                        class="general-sans-medium text-[#FD6A6A] focus:text-[#FD6A6A] dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        value="overdue"
                      >
                        <div class="flex items-center">
                          <Icon
                            icon="radix-icons:dot-filled"
                            class="bg-[#FD6A6A] rounded-full mr-2 h-[6px] w-[6px] rotate-0 scale-100 transition-all dark:-rotate-90"
                          />
                          <div>Overdue</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <!-- Table Data -->
        <div v-if="loading">
          <div
            class="flex items-center space-x-4 p-5 md:p-10"
            v-for="(i, index) in 4"
            :key="index"
          >
            <Skeleton class="h-12 w-12 rounded-full bg-[#E5E7EB] dark:bg-neutral-600" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-[250px] bg-[#E5E7EB] dark:bg-neutral-600" />
              <Skeleton class="h-4 w-[200px] bg-[#E5E7EB] dark:bg-neutral-600" />
            </div>
            <div class="space-y-2 hidden md:block">
              <Skeleton class="h-4 w-[250px] bg-[#E5E7EB] dark:bg-neutral-600" />
              <Skeleton class="h-4 w-[200px] bg-[#E5E7EB] dark:bg-neutral-600" />
            </div>
            <div class="space-y-2 hidden lg:block">
              <Skeleton class="h-4 w-[250px] bg-[#E5E7EB] dark:bg-neutral-600" />
              <Skeleton class="h-4 w-[200px] bg-[#E5E7EB] dark:bg-neutral-600" />
            </div>
            <div class="space-y-2 hidden xl:block">
              <Skeleton class="h-4 w-[250px] bg-[#E5E7EB] dark:bg-neutral-600" />
              <Skeleton class="h-4 w-[200px] bg-[#E5E7EB] dark:bg-neutral-600" />
            </div>
          </div>
        </div>
        <DataTable
          :paymentHeaders="paymentHeaders"
          :paymentData="paymentData"
          :list="filterPaymentTransactions"
          @numperpage="getPaymentsByNumOfPage"
          @setpage="getPaymentsByPage"
          @selecteditems="setSelectedItems"
          v-else
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
