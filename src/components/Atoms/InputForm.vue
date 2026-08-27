<script setup lang="ts">
type Props = {
  disabled?: boolean
  modelValue?: string
  name: string
  placeholder?: string
  type?: 'text' | 'password' | 'email'
  autocomplete?: string
  onKeydown?: (event: KeyboardEvent) => void
}

type Emits = {
  (e: "update:modelValue", value: string): void;
}

const { disabled, modelValue, name, placeholder, type = 'text', autocomplete, onKeydown } =
  defineProps<Props>();

defineEmits<Emits>();
</script>

<template>
  <input
    :type="type"
    class="input"
    :disabled="disabled"
    :placeholder="placeholder"
    :name="name"
    :autocomplete="autocomplete"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
    @keydown="onKeydown"
  />
</template>

<style scoped>
.input {
  color: white;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 50px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 20px;
  font-family: 'Times New Roman', Times, serif;
  border-radius: 5px;
}

.input:disabled {
  color: #000;
}

.input::placeholder {
  color: #c0c0c0;
}
</style>
