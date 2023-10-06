<template>
   <div class="die-container">
      <div class="die"
         :class="{ 'isRolling': isRolling }"
         :data-show="value">
         <div class="one face cube__face--front">
            <span class="dot"></span>
         </div>
         <div class="two face cube__face--left">
            <span class="dot"></span>
            <span class="dot"></span>
         </div>
         <div class="three face cube__face--bottom">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
         </div>
         <div class="four face cube__face--top">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
         </div>
         <div class="five face cube__face--right">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
         </div>
         <div class="six face cube__face--back">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NumberRowColor } from '../lib/create-score-card';

const props = defineProps({
   isRolling: {
      type: Boolean,
      default() { return false; },
   },
   value: {
      type: Number,
      required: true,
   },
   color: {
      type: String as () => NumberRowColor,
   },
});

const dieColorVar = computed(() => {
   if (!props.color) {
      return '#fff';
   }

   return `var(--color-game-${props.color})`;
});

const dieDotColorVar = computed(() => {
   if (!props.color) {
      return '#333';
   }
   return '#fff';
});
</script>

<style>
.dice-container {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
}

.die-container {
   --die-width: 80px;
   --die-width-negative: calc(-1 * var(--die-width) / 2);
   --die-transformation: calc(var(--die-width) / 2);
   --die-transformation-negative: calc(-1 * var(--die-width) / 2);
   --dot-diameter: calc(var(--die-width) / 5);
   width: var(--die-width);
   height: var(--die-width);
   margin: 8px;
}

.die {
   --die-color: v-bind(dieColorVar);
   --die-dot-color: v-bind(dieDotColorVar);
   position: relative;
   transform: translateZ(var(--die-transformation-negative));
   transform-style: preserve-3d;
   width: var(--die-width);
   height: var(--die-width);
}

.dot {
   display: block;
   position: absolute;
   border-radius: 100%;
   background-color: var(--die-dot-color);
   width: var(--dot-diameter);
   height: var(--dot-diameter);
}

.face {
   position: absolute;
   width: var(--die-width);
   height: var(--die-width);
   border: 1px solid rgba(0, 0, 0, 0.3);
   border-radius: 10px;
   background-color: var(--die-color);
   box-shadow:inset 0 0 8px rgba(0, 0, 0, 0.2);
}

/*
   ======= Dot (pip) layouts =======
*/
.one .dot {
   position: absolute;
   left: calc(50% - var(--dot-diameter) / 2);
   top: calc(50% - var(--dot-diameter) / 2);
}

.two .dot:nth-child(1) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.two .dot:nth-child(2) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}

.three .dot:nth-child(1) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.three .dot:nth-child(2) {
   left: calc(50% - var(--dot-diameter) / 2);
   top: calc(50% - var(--dot-diameter) / 2);
}
.three .dot:nth-child(3) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}

.four .dot:nth-child(1) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.four .dot:nth-child(2) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.four .dot:nth-child(3) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}
.four .dot:nth-child(4) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}

.five .dot:nth-child(1) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.five .dot:nth-child(2) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.five .dot:nth-child(3) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}
.five .dot:nth-child(4) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}
.five .dot:nth-child(5) {
   left: calc(50% - var(--dot-diameter) / 2);
   top: calc(50% - var(--dot-diameter) / 2);
}

.six .dot:nth-child(1) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.six .dot:nth-child(2) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(50% - var(--dot-diameter) / 2);
}
.six .dot:nth-child(3) {
   left: calc(25% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}
.six .dot:nth-child(4) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(25% - var(--dot-diameter) / 2);
}
.six .dot:nth-child(5) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(50% - var(--dot-diameter) / 2);
}
.six .dot:nth-child(6) {
   left: calc(75% - var(--dot-diameter) / 2);
   top: calc(75% - var(--dot-diameter) / 2);
}

/* Transforms the cube faces to 3 dimensions */
.cube__face--front  { transform: rotateY(  0deg) translateZ(var(--die-transformation)); }
.cube__face--right  { transform: rotateY( 90deg) translateZ(var(--die-transformation)); }
.cube__face--back   { transform: rotateY(180deg) translateZ(var(--die-transformation)); }
.cube__face--left   { transform: rotateY(-90deg) translateZ(var(--die-transformation)); }
.cube__face--top    { transform: rotateX( 90deg) translateZ(var(--die-transformation)); }
.cube__face--bottom { transform: rotateX(-90deg) translateZ(var(--die-transformation)); }

/*
   ======= Generic transforms for showing cube faces =======
*/
[data-show="1"] { transform: translateZ(var(--die-transformation-negative)) rotateY(   0deg); }
[data-show="5"] { transform: translateZ(var(--die-transformation-negative)) rotateY( -90deg); }
[data-show="6"] { transform: translateZ(var(--die-transformation-negative)) rotateY(-180deg); }
[data-show="2"] { transform: translateZ(var(--die-transformation-negative)) rotateY(  90deg); }
[data-show="4"] { transform: translateZ(var(--die-transformation-negative)) rotateX( -90deg); }
[data-show="3"] { transform: translateZ(var(--die-transformation-negative)) rotateX(  90deg); }

/*
   ======= Roll animation =======
*/
@keyframes spin {
   0% { transform: translateZ(var(--die-width-negative)) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
   16% { transform: translateZ(var(--die-width-negative)) rotateX(180deg) rotateY(180deg) rotateZ(0deg); }
   33% { transform: translateZ(var(--die-width-negative)) rotateX(360deg) rotateY(90deg) rotateZ(180deg); }
   50% { transform: translateZ(var(--die-width-negative)) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
   66% { transform: translateZ(var(--die-width-negative)) rotateX(180deg) rotateY(360deg) rotateZ(270deg); }
   83% { transform: translateZ(var(--die-width-negative)) rotateX(270deg) rotateY(180deg) rotateZ(180deg); }
   100% { transform: translateZ(var(--die-width-negative)) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
}

.isRolling {
   animation: spin 1.6s infinite linear;
}
</style>
