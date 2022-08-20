<template>
   <button><slot></slot></button>
</template>

<style scoped>
button {
   display: inline-flex;
   justify-content: center;
   align-items: center;
   font-size: 28px;
   font-weight: 900;
   appearance: none;
   cursor: pointer;
   padding: 10px;
   width: 60px;
   aspect-ratio: 1 / 1;
   border: 1px solid black;
   color: black;
   border-radius: 4px;
   background-color: rgba(255, 255, 255, 0.5);
}
button[disabled] {
   pointer-events: none;
   opacity: 0.5;
}
</style>
