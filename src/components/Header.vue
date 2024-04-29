<script setup>
import { useColorMode } from "@vueuse/core";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const mode = useColorMode();
</script>

<template>
    <div
      class="flex flex-col sm:flex-row sm:justify-between items-center bg-[#FFFFFF] dark:bg-neutral-800 py-4 px-10"
    >
      <h2 class="general-sans-bold text-[20px]">Table Heading</h2>
      <div class="flex flex-col sm:flex-row gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="mt-3 sm:mt-0 dark:bg-neutral-700">
              <Icon
                icon="radix-icons:moon"
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <Icon
                icon="radix-icons:sun"
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="dark:bg-neutral-800 border-0 shadow-[0px_5px_15px_0px_#00000033]">
            <DropdownMenuItem class="dark:hover:bg-neutral-700 general-sans-medium" @click="mode = 'light'"> Light </DropdownMenuItem>
            <DropdownMenuItem class="dark:hover:bg-neutral-700 general-sans-medium" @click="mode = 'dark'"> Dark </DropdownMenuItem>
            <DropdownMenuItem class="dark:hover:bg-neutral-700 general-sans-medium" @click="mode = 'auto'"> System </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <img src="../assets/images/Avatar.svg" class="mt-3 sm:mt-0" />
        <div class="mt-3 sm:mt-0">
          <h2 class="general-sans-bold text-center sm:text-left">Oladapo Daniel</h2>
          <div
            class="text-[#718096] dark:text-neutral-50 text-[12px] text-center sm:text-left"
          >
            Frontend Developer
          </div>
        </div>
      </div>
    </div>
</template>