export interface DiceNumber {
   number: number;
   checked: boolean;
}

export enum NumberRowColor {
   Red = 'red',
   Yellow = 'yellow',
   Green = 'green',
   Blue = 'blue',
}

export interface NumberRow {
   numbers: DiceNumber[];
   color: NumberRowColor;
   locked: boolean;
}

export interface Penalty {
   checked: boolean;
}

export interface ScoreCard {
   rows: NumberRow[];
   penalties: Penalty[];
}

function createDiceNumber(number: number): DiceNumber {
   return {
      number,
      checked: false,
   };
}

function createDiceNumberRow(color: NumberRowColor): NumberRow {
   return {
      color,
      numbers: [],
      locked: false,
   };
}

export function findRowByColor(rows: NumberRow[], color: NumberRowColor): NumberRow | undefined {
   return rows.find(r => r.color === color);
}

function createPenalties(): Penalty[] {
   return [
      { checked: false },
      { checked: false },
      { checked: false },
      { checked: false },
   ];
}

export function createScoreCard(): ScoreCard {
   const red = createDiceNumberRow(NumberRowColor.Red),
         yellow = createDiceNumberRow(NumberRowColor.Yellow),
         green = createDiceNumberRow(NumberRowColor.Green),
         blue = createDiceNumberRow(NumberRowColor.Blue);

   for (let i = 2; i <= 12; i++) {
      red.numbers.push(createDiceNumber(i));
      yellow.numbers.push(createDiceNumber(i));
      green.numbers.push(createDiceNumber(14 - i));
      blue.numbers.push(createDiceNumber(14 - i));
   }

   return {
      rows: [ red, yellow, green, blue ],
      penalties: createPenalties(),
   };
}
