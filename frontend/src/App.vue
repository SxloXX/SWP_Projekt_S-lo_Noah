<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <RouterLink class="logo" to="/">📚 Bücherei-Portal</RouterLink>
      <nav class="app-nav">
        <RouterLink to="/buecher">Bücher</RouterLink>
        <RouterLink to="/ausleihen">Ausleihen</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">SWP-Projekt · Flask + Vue</footer>
  </div>
</template>
