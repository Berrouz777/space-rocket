<template>
    <button type="button" class="admin-button flex items-center justify-center" @click="emit('click', $event)">
        <component :is="props.icon" class="admin-button__icon" />
    </button>
</template>

<script setup lang="ts">
    import type { Component } from 'vue'

    const props = defineProps<{
        icon: Component
    }>()

    const emit = defineEmits<{
        click: [event: MouseEvent]
    }>()
</script>

<style scoped>
    .admin-button {
        width: clamp(36px, 7cqw, 62px);
        height: clamp(36px, 7cqw, 62px);
    }

    .admin-button:active {
        opacity: 0.8;
    }

    .admin-button__icon {
        width: clamp(20px, 5cqw, 56px);
        height: clamp(20px, 5cqw, 56px);
    }

    .admin-button :deep(svg) {
        filter: drop-shadow(0px 0px 7px #f65858);
    }
</style>
