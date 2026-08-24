import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { TodoType, TodoId } from '../types/todo'

export const originTodoListInjectionKey: InjectionKey<Ref<TodoType[]>> = Symbol()

export const showTodoListInjectionKey: InjectionKey<ComputedRef<TodoType[]>> = Symbol()

export const searchKeywordInjectionKey: InjectionKey<Ref<string>> = Symbol()

export const fetchTodoListInjectionKey: InjectionKey<() => Promise<void>> = Symbol()

export const handleAddTodoInjectionKey: InjectionKey<
  (title: string, content: string) => void
> = Symbol()

export const handleUpdateTodoInjectionKey: InjectionKey<
  (targetId: TodoId | string, title: string, content: string) => void
> = Symbol()

export const handleDeleteTodoInjectionKey: InjectionKey<
  (targetId: TodoId | string, targetTitle: string) => void
> = Symbol()
