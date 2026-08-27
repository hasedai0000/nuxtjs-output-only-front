import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { UserType } from '../types/user'

export const currentUserInjectionKey: InjectionKey<Ref<UserType | null>> = Symbol()

export const isAuthenticatedInjectionKey: InjectionKey<ComputedRef<boolean>> = Symbol()

export const authErrorInjectionKey: InjectionKey<Ref<string | null>> = Symbol()

export const isAuthInitializedInjectionKey: InjectionKey<Ref<boolean>> = Symbol()

export const initAuthInjectionKey: InjectionKey<() => Promise<void>> = Symbol()

export const handleLoginInjectionKey: InjectionKey<
  (email: string, password: string) => Promise<boolean>
> = Symbol()

export const handleRegisterInjectionKey: InjectionKey<
  (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<boolean>
> = Symbol()

export const handleLogoutInjectionKey: InjectionKey<() => Promise<boolean>> = Symbol()
