<template>
  <div>
      <span class="gameCode" v-if="game.roomCode">
         Code: {{ game.roomCode }}
      </span>
      <div v-if="!connected && quickConnectCode">
         <h2>Connecting to room: {{ quickConnectCode }}</h2>
         <h3>Enter your name</h3>
         <div class="field"><input type="text" v-model="me.name" placeholder="Enter your name" /></div>
         <button class="button blue" @click="game.connectToRoom(quickConnectCode || '', me)">Connect to room</button>
      </div>
      <div v-else-if="!connected && !quickConnectCode">
         <h3>Create a new room</h3>
         <div class="field"><input type="text" v-model="me.name" placeholder="Enter your name" /></div>
         <button class="button green" @click="game.create(generatedCode, me)">Create new room</button>

         <span class="or"><span>or</span></span>

         <h3>Connect to a room</h3>
         <div class="field"><input type="text" v-model="me.name" placeholder="Enter your name" /></div>
         <div class="field"><input type="text" v-model="connectCode" placeholder="Room code"></div>
         <button class="button blue" @click="game.connectToRoom(connectCode, me)">Connect</button>
      </div>
      <template v-else>
         <div v-if="store.players.length < 2">
            <h1>Waiting for more players...</h1>
            <h2>
               Give them this room code: {{ game.roomCode }}
               <template v-if="hasClipboardAccess">
                  or
                  <a href="#" role="button" @click.prevent="copyInviteLink">
                     tap here to copy an invite link
                  </a>.
               </template>
            </h2>
         </div>
         <div v-else>
            <div class="dice">
               <div class="diceToRoll">
                  <Die v-for="die of store.diceToRoll"
                     :value="die.value"
                     :is-rolling="die.isRolling"
                     :color="die.color"
                     :key="die.id" />
               </div>
               <button class="button blue" @click="game.rollDice()">Roll</button>
            </div>

            <h3>Other Players</h3>
            <div class="otherPlayers">
               <div class="otherPlayer" v-for="p of otherPlayers">
                  {{ p.name }}
                  <MiniScoreCard v-if="store.state[p.id]"
                     :score-card="(store.state[p.id] as ScoreCard)" />
               </div>
            </div>
            <ScoreCardView v-if="store.state[me.id]" :score-card="store.state[me.id]" :is-locked-by-any-player="isLockedByAnyPlayer" />
         </div>
      </template>
  </div>
</template>

<script setup lang="ts">
import * as Y from 'yjs';
import YPartyKitProvider from 'y-partykit/provider';
import { syncedStore, getYjsValue, filterArray } from '@syncedstore/core';
import { computed, Ref, ref, watch } from 'vue';
import ScoreCardView from './ScoreCard.vue';
import { createScoreCard, NumberRow, NumberRowColor, ScoreCard } from '../lib/create-score-card';
import MiniScoreCard from './MiniScoreCard.vue';
import Die from './Die.vue';

function generateCode(): string {
   let code = '';

   for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 9 + 1);
   }

   return code;
}

interface Player {
   id: string;
   name: string;
}

interface Die {
   id: number;
   isRolling: boolean;
   value: number;
   color?: NumberRowColor;
}

type Dice = Die[];

function generateID() {
   if (typeof window.crypto !== 'undefined') {
      return crypto.randomUUID();
   }
   return `${Math.random()}`.split('.')[1];
}

const me = ref<Player>({ name: localStorage.getItem('playerName') || '', id: localStorage.getItem('playerID') || generateID() });

if (!localStorage.getItem('playerID')) {
   localStorage.setItem('playerID', me.value.id);
}

watch(() => me.value.name, () => {
   localStorage.setItem('playerName', me.value.name);
});

type GameState = Record<string, ScoreCard>;

const url = new URL(location.href),
      quickConnectCode = url.searchParams.get('roomCode');

const generatedCode = generateCode(),
      connected = ref(false),
      connectCode = ref(quickConnectCode || '');

const store = syncedStore({
   state: {} as GameState,
   players: [] as Player[],
   diceToRoll: [] as Dice,
});

type Store = typeof store;

if (quickConnectCode) {
   url.searchParams.delete('roomCode');
   history.replaceState(undefined, '', url.toString());
}

class Game {
   doc: Y.Doc | Y.AbstractType<any> | undefined;
   provider: YPartyKitProvider | undefined;
   roomCode: string | undefined;
   store: Store;
   connected: Ref<boolean>;

   constructor(store: Store, connected: Ref<boolean>) {
      this.store = store;
      this.connected = connected;
   }

   create(code: string, player: Player) {
      this.connectToRoom(code, player);
      this.store.diceToRoll.push({ id: 0, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Blue });
      this.store.diceToRoll.push({ id: 1, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Green });
      this.store.diceToRoll.push({ id: 2, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Yellow });
      this.store.diceToRoll.push({ id: 3, value: Math.floor(Math.random() * 6 + 1), isRolling: false, color: NumberRowColor.Red });
      this.store.diceToRoll.push({ id: 4, value: Math.floor(Math.random() * 6 + 1), isRolling: false });
      this.store.diceToRoll.push({ id: 5, value: Math.floor(Math.random() * 6 + 1), isRolling: false });
   }

   connectToRoom(code: string, player: Player) {
      this.roomCode = code;

      const connString = `dice-together-${code}`;

      this.doc = getYjsValue(this.store) as Y.Doc;

      this.provider = new YPartyKitProvider(import.meta.env.VITE_PARTYKIT_HOST, connString, this.doc as any);

      this.connected.value = true;

      const existingPlayer = this.store.players.find((p) => p.id === me.value.id);

      if (existingPlayer) {
         me.value = existingPlayer;
         this.provider?.awareness.setLocalStateField('user', player);
      } else {
         this.store.players.push(player);
         this.store.state[player.id] = createScoreCard();
      }
      this.provider?.awareness.setLocalStateField('user', player);


      this.provider.on('status', (event: any) => {
         if (event.status === 'disconnected') {
            this.store.players.splice(this.store.players.indexOf(me.value), 1);
         }
      });

      this.provider.awareness.on('change', () => {
         const connectedIDs: string[] = [];

         this.provider?.awareness.getStates().forEach(state => {
            connectedIDs.push(state.user.id);
         });

         filterArray(this.store.players, (p) => {
            return connectedIDs.includes(p.id);
         });
      });

      window.onbeforeunload = () => {
         const index = this.store.players.findIndex(p => p.id === me.value.id);

         if (index !== -1) {
            this.store.players.splice(index, 1);
         }
      };
   }

   rollDice() {
      this.store.diceToRoll.forEach((d) => {
         d.isRolling = true;
      });

      setTimeout(() => {
         this.store.diceToRoll.forEach((d) => {
            d.isRolling = false;
            d.value = Math.floor(Math.random() * 6 + 1);
         });
      }, 1000);
   }
}

const hasClipboardAccess = ref(!!navigator.clipboard);

function copyInviteLink() {
   const url = new URL(location.href);

   url.searchParams.set('roomCode', game.roomCode || '');
   navigator.clipboard.writeText(url.toString());

   if (typeof navigator.share !== 'undefined') {
      navigator.share({ url: url.toString() });
   }
}

let game = new Game(store, connected);

const otherPlayers = computed(() => {
   return store.players.filter(p => p.id !== me.value.id);
});

function isLockedByAnyPlayer(row: NumberRow) {
   return otherPlayers.value.reduce((memo, p) => {
      return memo || !!game.store.state[p.id]?.rows.find(r => r.color === row.color)?.locked;
   }, false);
}
</script>

<style scoped>
.or {
   display: block;
   text-align: center;
   max-width: 150px;
   margin: 1em 0;
   opacity: 0.5;
}
.or span {
   display: inline-block;
   line-height: 1;
   padding: 0.25em;
   font-size: 2em;
   font-weight: 900;
   border-radius: 100%;
   background-color: #fff;
   position: relative;
}
.or::before {
   content: " ";
   display: block;
   border: 1px solid black;
   position: relative;
   top: 1.5em;
   z-index: -1;
}
.gameCode {
   position: absolute;
   top: 0;
   right: 0;
   padding: 0.25em;
   background-color: #fff;
   border: 1px solid rgb(200, 200, 200);
   z-index: 1000;
}
.otherPlayers {
   display: flex;
   flex-wrap: wrap;
   max-width: 100vw;
}
.otherPlayer {
   margin-right: 2em;
   margin-bottom: 1em;
}
.otherPlayer:last-child {
   margin-right: 0;
}
.diceToRoll,
.diceToHold {
   display: flex;
   flex-wrap: wrap;
}
</style>
