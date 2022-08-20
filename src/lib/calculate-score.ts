import { computed, ComputedRef } from 'vue';
import { findRowByColor, NumberRow, NumberRowColor, Penalty } from './create-score-card';

export function getTotalChecked(row: NumberRow) {
   return Array.from(row.numbers).reduce((memo, n) => {
      return memo + (n.checked ? 1 : 0);
   }, 0);
}

export function getTotalForNumberChecked(totalCheckedInRow: number) {
   return (totalCheckedInRow * (totalCheckedInRow + 1)) / 2;
}

export function calculateTotal(row: NumberRow | undefined) {
   if (!row) {
      return 0;
   }
   let totalCheckedInRow = getTotalChecked(row);

   totalCheckedInRow = totalCheckedInRow + (row.locked ? 1 : 0);

   return getTotalForNumberChecked(totalCheckedInRow);
}

type RowTotals = Record<NumberRowColor, ComputedRef<number>>;

export function calculateGrandTotal(rowTotals: RowTotals, totalPenalties: number) {
   const total = Object.values(rowTotals).reduce((memo, t) => memo + t.value, 0)

   return total - totalPenalties;
}

export function createRowTotals(rows: NumberRow[]): Record<NumberRowColor, ComputedRef<number>> {
   return {
      [NumberRowColor.Red]: computed(() => calculateTotal(findRowByColor(rows, NumberRowColor.Red))),
      [NumberRowColor.Yellow]: computed(() => calculateTotal(findRowByColor(rows, NumberRowColor.Yellow))),
      [NumberRowColor.Green]: computed(() => calculateTotal(findRowByColor(rows, NumberRowColor.Green))),
      [NumberRowColor.Blue]: computed(() => calculateTotal(findRowByColor(rows, NumberRowColor.Blue))),
   };
}

export function calculateTotalPenalties(penalties: Penalty[]) {
   return Array.from(penalties).reduce((memo, p) => memo + (p.checked ? 5 : 0), 0);
}
