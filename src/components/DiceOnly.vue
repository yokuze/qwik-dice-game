<template>
<div class="dice">
   <div class="diceToRoll">
      <Die v-for="die of diceToRoll"
         :value="die.value"
         :is-rolling="die.isRolling"
         :color="die.color"
         :key="die.id" />
   </div>
   <button class="button blue" @click="rollDice()">Roll</button>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NumberRowColor } from '../lib/create-score-card';
import Die from './Die.vue';

interface Die {
   id: number;
   isRolling: boolean;
   value: number;
   color?: NumberRowColor;
}

type Dice = Die[];


const diceToRoll = ref<Dice>([
   { id: 0, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Blue },
   { id: 1, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Green },
   { id: 2, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Yellow },
   // { id: 3, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Red },
   { id: 4, value: Math.floor(Math.random() * 6 + 1), isRolling: false },
   { id: 5, value: Math.floor(Math.random() * 6 + 1), isRolling: false },
]);

function rollDice() {
   diceToRoll.value.forEach((d) => {
      d.isRolling = true;
   });

   setTimeout(() => {
      diceToRoll.value.forEach((d) => {
         d.value = Math.floor(Math.random() * 6 + 1);
         d.isRolling = false;
      });
   }, 1000);
}
</script>

<style scoped>
.diceToRoll {
   display: flex;
   flex-wrap: wrap;
   margin-bottom: 2em;
}
</style>
