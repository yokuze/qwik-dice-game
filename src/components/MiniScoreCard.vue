<template>
   <div class="miniScoreCard">
      <div class="score">{{ score }}</div>
      <div class="miniRows">
         <div class="miniRow" v-for="row in props.scoreCard.rows">
            <div class="miniDiceNumber"
               :class="{ checked: n.checked }"
               v-for="n in row.numbers"
               :key="n.number"
               :style="{ backgroundColor: n.checked ? `var(--color-game-${row.color})` : 'rgb(200, 200, 200)' }">
            </div>
            <div class="miniLock" v-if="row.locked" v-html="lock"></div>
         </div>
         <div class="miniRow penalties">
            <div class="penalty" v-for="penalty of scoreCard.penalties">
               <span v-if="penalty.checked">&times;</span>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ScoreCard } from '../lib/create-score-card';
import { calculateGrandTotal, calculateTotalPenalties, createRowTotals } from '../lib/calculate-score';
import lock from '../assets/lock.svg?raw';

const props = defineProps({
   scoreCard: {
      type: Object as () => ScoreCard,
      required: true,
   },
});

const score = computed(() => {
   const rowTotals = createRowTotals(props.scoreCard.rows);

   // We have to use Array.from to transform it into a real Array instead of a Y.Array,
   // which only implements a subset of built-in Array methods.
   return calculateGrandTotal(rowTotals, calculateTotalPenalties(Array.from(props.scoreCard.penalties)));
});
</script>

<style scoped>
.miniScoreCard {
   display: flex;
   align-items: center;
}
.score {
   box-sizing: border-box;
   font-size: 2em;
   font-weight: 900;
   margin-right: 10px;
   padding: 0.25em;
   border: 1px solid rgb(220, 220, 220);
   border-radius: 4px;
   width: 2em;
   text-align: center;
}
.miniRow {
   display: flex;
   flex-wrap: nowrap;
   align-items: center;
   margin-bottom: 2px;
}
.miniDiceNumber {
   width: 10px;
   height: 10px;
}
.miniDiceNumber + .miniDiceNumber,
.penalty + .penalty {
   margin-left: 4px;
}
.miniLock {
   width: 10px;
   height: 10px;
   font-size: 12px;
   margin-left: 2px;
}
.penalties {
   margin-top: 6px;
}
.penalty {
   width: 10px;
   height: 10px;
   background-color: rgb(220, 220, 220);
   line-height: 0.5;
   font-weight: 900;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 0.7em;
}
</style>
