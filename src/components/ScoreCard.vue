<template>
   <div class="numberRows">
      <div class="atLeastFiveContainer">
          <div class="atLeastFive">
            <h4>At least 5 X's</h4>
         </div>

         <div class="numberRow row"
            v-for="row in props.scoreCard.rows"
            :style="{ backgroundColor: `var(--color-game-${row.color})` }"
            :class="{ locked: isRowLocked(row) }">
            <SquareButton class="diceNumber checkable"
               v-for="n in row.numbers"
               :key="n.number"
               @click="onCheckNumber(n, row)"
               :disabled="!isNumberCheckable(row, n)">
               {{ n.number }}
               <span class="x" v-if="n.checked">&times;</span>
            </SquareButton>
            <LockRowButton v-on:lockStateChanged="(isLocked) => onLockStateChange(row, isLocked)" :disabled="!IS_ROW_LOCKABLE[row.color]" />
         </div>
      </div>

      <div class="row alignItemsCenter">
         <div class="scoreReference">
            <div class="xs"># of X's</div>
            <div class="score">points</div>
         </div>
         <div v-for="reference in scoreReference" :key="reference.numberOfXs" class="scoreReference">
            <div class="xs">{{ reference.numberOfXs }}</div>
            <div class="score">{{ reference.score }}</div>
         </div>
      </div>
   </div>

   <div class="penalties">
      <h3>PENALTIES (-5 each)</h3>
      <div class="row">
         <SquareButton class="checkable" v-for="(penalty, idx) in props.scoreCard.penalties" :key="idx" @click="penalty.checked = !penalty.checked">
            <span class="x" v-if="penalty.checked">&times;</span>
         </SquareButton>
      </div>
   </div>

   <div class="row">
      <div class="totals">
         <h3>TOTALS</h3>
         <span class="total">RED: {{ rowTotals[NumberRowColor.Red] }}</span>
         <span class="total">YELLOW: {{ rowTotals[NumberRowColor.Yellow] }}</span>
         <span class="total">GREEN: {{ rowTotals[NumberRowColor.Green] }}</span>
         <span class="total">BLUE: {{ rowTotals[NumberRowColor.Blue] }}</span>
         <span class="total">PENALTIES: {{ totalPenalties }}</span>
      </div>
      <div class="grandTotal">
         <p class="value">{{ grandTotal }}</p>
         <span>GRAND TOTAL</span>
      </div>
   </div>

   <button class="restartGame" @click="restartGame">Restart Game</button>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import SquareButton from './SquareButton.vue';
import LockRowButton from './LockRowButton.vue';
import { createScoreCard, DiceNumber, findRowByColor, NumberRow, NumberRowColor, ScoreCard } from '../lib/create-score-card';
import { calculateGrandTotal, calculateTotalPenalties, createRowTotals, getTotalChecked, getTotalForNumberChecked } from '../lib/calculate-score';

interface LockCheckFunction {
   (row: NumberRow): boolean;
}

const props = defineProps({
   scoreCard: {
      type: Object as () => ScoreCard,
      default() {
         return reactive(createScoreCard());
      },
   },
   isLockedByAnyPlayer: {
      type: Function as any as () => LockCheckFunction,
      default() {
         return false;
      },
   },
})

function onLockStateChange(row: NumberRow, isLocked: boolean) {
   row.locked = isLocked;
}

function onCheckNumber(n: DiceNumber, row: NumberRow) {
   if (!row.locked) {
      n.checked = !n.checked;
   }
}

function uncheckAll(row: NumberRow) {
   row.locked = false;
   row.numbers.map(r => r.checked = false);
}

const isRowLockable = (row: NumberRow | undefined) => {
   return row ? getTotalChecked(row) >= 5 : false;
};

function hasCheckedNumberAfter(row: NumberRow, n: DiceNumber) {
   const nIndex = row.numbers.indexOf(n);

   for (let num of row.numbers.slice(nIndex + 1)) {
      if (num.checked) {
         return true;
      }
   }

   return false;
}

const isNumberCheckable = (row: NumberRow, n: DiceNumber) => {
   return n.checked || (row.numbers.indexOf(n) !== (row.numbers.length -1) || isRowLockable(row)) && !hasCheckedNumberAfter(row, n) && !props.isLockedByAnyPlayer(row);
};

const IS_ROW_LOCKABLE = ref({
   [NumberRowColor.Red]: computed(() => isRowLockable(findRowByColor(props.scoreCard.rows, NumberRowColor.Red))),
   [NumberRowColor.Yellow]: computed(() => isRowLockable(findRowByColor(props.scoreCard.rows, NumberRowColor.Yellow))),
   [NumberRowColor.Green]: computed(() => isRowLockable(findRowByColor(props.scoreCard.rows, NumberRowColor.Green))),
   [NumberRowColor.Blue]: computed(() => isRowLockable(findRowByColor(props.scoreCard.rows, NumberRowColor.Blue))),
});

const rowTotals = createRowTotals(props.scoreCard.rows);

function createPenalties() {
   return [
      { checked: false },
      { checked: false },
      { checked: false },
      { checked: false },
   ];
}

const totalPenalties = computed(() => calculateTotalPenalties(props.scoreCard.penalties));

const grandTotal = computed(() => {
   return calculateGrandTotal(rowTotals, totalPenalties.value);
});

function restartGame() {
   props.scoreCard.penalties = createPenalties();
   props.scoreCard.rows.forEach(uncheckAll);
}

const scoreReference = Array.from(Array(12).keys()).map((i) => {
   return {
      numberOfXs: `${i + 1}x`,
      score: String(getTotalForNumberChecked(i + 1)),
   };
});

function isRowLocked(row: NumberRow) {
   return row.locked || props.isLockedByAnyPlayer(row);
}
</script>

<style>
#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: black;
}

h1, h2, h3, h4, h5 {
   margin-bottom: 0.25em;
}

.numberRows {
   overflow-x: auto;
   width: fit-content;
}

.atLeastFiveContainer {
   padding-top: 2em;
   padding-right: 10px;
   position: relative;
}

.atLeastFive {
   position: absolute;
   top: 0;
   right: -0;
   bottom: -10px;
   padding: 4px 12px;
   width: 130px;
   border-radius: 4px;
   text-align: center;
   border: 1px solid black;
}

.atLeastFive h4 {
   margin: 0;
}

.numberRow {
   padding: 10px;
   border: 1px solid black;
}

.row {
   display: flex;
   margin-bottom: 10px;
   width: fit-content;
}

.row > * + * {
   margin-left: 10px;
}

.alignItemsCenter {
   align-items: center;
}

.checkable {
   position: relative;
}

.diceNumber .x {
   display: flex;
   justify-content: center;
   align-items: center;
   position: absolute;
   font-size: 90px;
   font-weight: 200;
   top: 0;
   left: 0;
   bottom: 0;
   right: 0;
   line-height: 1;
   color: rgba(0, 0, 0, 0.4);
}

.numberRow.locked {
   opacity: 0.4;
}

.scoreReference {
   display: flex;
   flex-direction: column;
   padding: 8px;
   border-radius: 3px;
   color: #333;
   border: 1px solid currentColor;
   text-align: center;
}

.scoreReference .xs:after {
   content: " ";
   display: block;
   border-top: 1px solid black;
   margin-top: 4px;
   padding-top: 4px;
}

.total {
   display: block;
   margin-bottom: 6px;
}

.grandTotal {
   text-align: center;
   margin-left: 30px;
   padding: 12px;
   border: 1px solid #999;
   align-self: center;
}

.grandTotal .value {
   font-variant-numeric: tabular-nums;
   font-size: 82px;
   font-weight: 900;
   line-height: 1;
   padding: 0;
   margin: 0;
}

button.restartGame {
   font-size: 16px;
   font-weight: 900;
   appearance: none;
   cursor: pointer;
   padding: 10px;
   color: tomato;
   border: 1px solid tomato;
   border-radius: 2px;
   background-color: rgba(255, 255, 255, 0.5);
}
</style>
