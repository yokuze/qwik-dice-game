<template>
   <SquareButton class="lockRowButton" v-html="icon" @click="toggleLock"></SquareButton>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import lock from './assets/lock.svg?raw';
import unlock from './assets/unlock.svg?raw';
import SquareButton from './SquareButton.vue';

const locked = ref(false);

const icon = computed(() => {
   return locked.value ? lock : unlock;
});

const emit = defineEmits([ 'lockStateChanged' ]);

function toggleLock() {
   locked.value = !locked.value;

   emit('lockStateChanged', locked.value);
}
</script>

<style>
.lockRowButton {
   font-size: 50px;
}
.lockRowButton > * {
   transform: rotate(45deg) scale(1.25) scaleX(-1) translateX(-2px) translateY(-3px);
}
</style>
