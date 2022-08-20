<template>
   <div class="chooseGameType" v-if="!gameType">
      <h1>Play Dice</h1>
      <div class="gameTypes">
         <p><button class="button green" @click="gameType = GameType.ONLINE">Play online</button></p>
         <p><button class="button blue" @click="gameType = GameType.LOCAL">Score card only</button></p>
      </div>
   </div>
   <PlayOnline v-else-if="gameType === GameType.ONLINE"></PlayOnline>
   <ScoreCard v-else-if="gameType === GameType.LOCAL" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScoreCard from './components/ScoreCard.vue';
import PlayOnline from './components/PlayOnline.vue';

enum GameType {
   LOCAL = 'LOCAL',
   ONLINE = 'ONLINE',
}

const gameType = ref<GameType | undefined>(undefined),
      url = new URL(location.href);

if (url.searchParams.has('roomCode')) {
   gameType.value = GameType.ONLINE;
}
</script>

<style>
#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: black;
   --color-game-red-h: 360;
   --color-game-red-s: 58%;
   --color-game-red-l: 47.6%;
   --color-game-red: hsl(var(--color-game-red-h), var(--color-game-red-s), var(--color-game-red-l));

   --color-game-yellow-h: 36;
   --color-game-yellow-s: 60%;
   --color-game-yellow-l: 59.8%;
   --color-game-yellow: hsl(var(--color-game-yellow-h), var(--color-game-yellow-s), var(--color-game-yellow-l));

   --color-game-green-h: 126;
   --color-game-green-s: 25.5%;
   --color-game-green-l: 41.6%;
   --color-game-green: hsl(var(--color-game-green-h), var(--color-game-green-s), var(--color-game-green-l));

   --color-game-blue-h: 224;
   --color-game-blue-s: 30.9%;
   --color-game-blue-l: 37.5%;
   --color-game-blue: hsl(var(--color-game-blue-h), var(--color-game-blue-s), var(--color-game-blue-l));
}

h1, h2, h3, h4, h5 {
   margin-bottom: 0.25em;
}
.button {
   font-size: 16px;
   font-weight: 900;
   appearance: none;
   cursor: pointer;
   padding: 10px;
   border: 0;
   background-color: var(--button-color);
   border-width: 1px;
   border-style: solid;
   border-radius: 3px;
   color: var(--button-textColor);
   --button-color--darkened: hsl(
      var(--button-color-h),
      var(--button-color-s),
      calc(var(--button-color-l) - var(--button-color-l) * 0.1)
   );
   border-color: var(--button-color--darkened);
}
.button:hover {
   background-color: var(--button-color--darkened);
}
.button.blue {
   --button-color: var(--color-game-blue);
   --button-textColor: #fff;
   --button-color-h: var(--color-game-blue-h);
   --button-color-s: var(--color-game-blue-s);
   --button-color-l: var(--color-game-blue-l);
}
.button.green {
   --button-color: var(--color-game-green);
   --button-textColor: #fff;
   --button-color-h: var(--color-game-green-h);
   --button-color-s: var(--color-game-green-s);
   --button-color-l: var(--color-game-green-l);
}
.chooseGameType {
   text-align: center;
}

input[type="text"] {
   font-size: 1.2rem;
   padding: 0.25em;
}

.field {
   margin-bottom: 0.5em;
}
</style>
