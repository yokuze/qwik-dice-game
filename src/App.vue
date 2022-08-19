<template>
   <div class="numberRows">
      <div class="atLeastFiveContainer">
          <div class="atLeastFive">
            <h4>At least 5 X's</h4>
         </div>

         <div class="numberRow row"
            v-for="row in rows"
            :style="{ backgroundColor: NUMBER_ROW_COLORS[row.value.color] }"
            :class="{ locked: row.value.locked }">
            <SquareButton class="diceNumber checkable"
               v-for="n in row.value.numbers"
               :key="n.number"
               @click="onCheckNumber(n, row.value)"
               :disabled="!isNumberCheckable(row.value, n)">
               {{ n.number }}
               <span class="x" v-if="n.checked">&times;</span>
            </SquareButton>
            <LockRowButton v-on:lockStateChanged="(isLocked) => onLockStateChange(row.value, isLocked)" :disabled="!IS_ROW_LOCKABLE[row.value.color]" />
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
         <SquareButton class="checkable" v-for="(penalty, idx) in penalties" :key="idx" @click="penalty.checked = !penalty.checked">
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
import { ref, computed, Ref } from 'vue';
import SquareButton from './SquareButton.vue';
import LockRowButton from './LockRowButton.vue';

interface DiceNumber {
   number: number;
   checked: boolean;
}

enum NumberRowColor {
   Red = 'red',
   Yellow = 'yellow',
   Green = 'green',
   Blue = 'blue',
}

interface NumberRow {
   numbers: DiceNumber[];
   color: NumberRowColor;
   locked: boolean;
}

const NUMBER_ROW_COLORS: Record<NumberRowColor, string> = {
   [NumberRowColor.Red]: 'rgb(192, 51, 52)',
   [NumberRowColor.Yellow]: 'rgb(214, 164, 91)',
   [NumberRowColor.Green]: 'rgb(79, 133, 84)',
   [NumberRowColor.Blue]: 'rgb(66, 82, 125)',
}

function createDiceNumber(number: number): DiceNumber {
   return {
      number,
      checked: false,
   };
}

function createDiceNumberRow(color: NumberRowColor): Ref<NumberRow> {
   return ref({
      color,
      numbers: [],
      locked: false,
   });
}

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

const red = createDiceNumberRow(NumberRowColor.Red),
      yellow = createDiceNumberRow(NumberRowColor.Yellow),
      green = createDiceNumberRow(NumberRowColor.Green),
      blue = createDiceNumberRow(NumberRowColor.Blue);

for (let i = 2; i <= 12; i++) {
   red.value.numbers.push(createDiceNumber(i));
   yellow.value.numbers.push(createDiceNumber(i));
   green.value.numbers.push(createDiceNumber(14 - i));
   blue.value.numbers.push(createDiceNumber(14 - i));
}

function getTotalChecked(row: NumberRow) {
   return row.numbers.reduce((memo, n) => {
      return memo + (n.checked ? 1 : 0);
   }, 0);
}

const rows = ref([ red, yellow, green, blue ]),
      isRowLockable = (row: NumberRow) => getTotalChecked(row) >= 5;

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
   return n.checked || (row.numbers.indexOf(n) !== (row.numbers.length -1) || isRowLockable(row)) && !hasCheckedNumberAfter(row, n);
};

const IS_ROW_LOCKABLE = ref({
   [NumberRowColor.Red]: computed(() => isRowLockable(red.value)),
   [NumberRowColor.Yellow]: computed(() => isRowLockable(yellow.value)),
   [NumberRowColor.Green]: computed(() => isRowLockable(green.value)),
   [NumberRowColor.Blue]: computed(() => isRowLockable(blue.value)),
});

function calculateTotal(row: NumberRow) {
   let totalCheckedInRow = getTotalChecked(row);

   totalCheckedInRow = totalCheckedInRow + (row.locked ? 1 : 0);

   return getTotalForNumberChecked(totalCheckedInRow);
}

function getTotalForNumberChecked(totalCheckedInRow: number) {
   return (totalCheckedInRow * (totalCheckedInRow + 1)) / 2;
}

const rowTotals = {
   [NumberRowColor.Red]: computed(() => calculateTotal(red.value)),
   [NumberRowColor.Yellow]: computed(() => calculateTotal(yellow.value)),
   [NumberRowColor.Green]: computed(() => calculateTotal(green.value)),
   [NumberRowColor.Blue]: computed(() => calculateTotal(blue.value)),
}

function createPenalties() {
   return [
      { checked: false },
      { checked: false },
      { checked: false },
      { checked: false },
   ];
}

const penalties = ref(createPenalties()),
      totalPenalties = computed(() => penalties.value.reduce((memo, p) => memo + (p.checked ? 5 : 0), 0));

const grandTotal = computed(() => {
   const total = Object.values(rowTotals).reduce((memo, t) => memo + t.value, 0)

   return total - totalPenalties.value;
});

function restartGame() {
   penalties.value = createPenalties();
   uncheckAll(red.value);
   uncheckAll(yellow.value);
   uncheckAll(green.value);
   uncheckAll(blue.value);
}

const scoreReference = Array.from(Array(12).keys()).map((i) => {
   return {
      numberOfXs: `${i + 1}x`,
      score: String(getTotalForNumberChecked(i + 1)),
   }
});
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
