### 1. Общие принципы

- Код должен быть единообразным, форматирование автоматизировано (Prettier + ESLint).
- Используем строгий TypeScript во всём проекте (`.ts`, `<script setup lang="ts">`).
- Компоненты, функции и переменные должны быть самодокументируемыми — минимум «магии».
- Не оставляем `console.log` и `debugger` в production.

---

### 2. Структура проекта

```
 /app
├── app.vue               # корневой компонент Nuxt, подключает layout и глобальные стили
├── modules               # доменные модули с изолированными компонентами и API
│   └── <module-name>
│       ├── components            # Vue-компоненты модуля
│       │   └── module-component-1
│       │       ├── moduleComponent1.vue   # основной компонент
│       │       └── components             # вложенные компоненты
│       │           └── small-component
│       │               └── smallComponent1.vue
│       ├── api                    # API-клиенты и endpoints
│       │   └── module.api.ts      # конкретные файлы с запросами (может быть несколько)
│       ├── store                  # Pinia setup stores
│       │   └── module.store.ts
│       ├── composables            # модульные composables (useXxx)
│       │   └── useFeature.ts
│       ├── types                  # типы, интерфейсы, DTO
│       │   └── module.types.ts
│       ├── enums                  # перечисления
│       │   └── module.enums.ts
│       ├── constants              # константы
│       │   └── module.constants.ts
│       └── utils                  # утилиты (pure-функции)
│           └── module.utils.ts
├── shared                # переиспользуемое ядро приложения
│   ├── composables       # утилитарные composable-функции (например, device utils)
│   ├── enums             # общие перечисления для модулей
│   ├── stores            # Pinia-сторы общего назначения
│   ├── ui                # UI-кит: кнопки, заголовки и др.
│   └── ...и другое
├── assets                # статические ресурсы и стили
│   ├── css               # исходники Tailwind и кастомных CSS-компонентов
│   └── images            # фоновые изображения и графика
├── layouts               # шаблоны Nuxt layout
└── pages                 # страницы Nuxt, определяющие маршруты

/i18n
└── en.json / ru.json     # файлы локализации

```

### 3. Нейминг

| **Что**             | **Рекомендуемый стиль** | **Пример**                                                                  | **Почему**                                                                   |
| ------------------- | ----------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Папки**           | `kebab-case`            | `user-profile/`, `game-board/`                                              | Универсальный стандарт во Vue, читаемость выше, нет проблем на Linux/Windows |
| **Vue-компоненты**  | `PascalCase`            | `UserCard.vue`, `GameBoard.vue`                                             | Принято во Vue, поддерживается автоимпортом Nuxt                             |
| **Stores**          | `kebab-case.store.ts`   | `user.store.ts`, `game.store.ts`<br>внутри → `useUserStore`, `useGameStore` | Ясно видно, что файл — Pinia store                                           |
| **TypeScript типы** | `kebab-case.types.ts`   | `user.types.ts`, `auth.types.ts`<br>внутри → `export interface User {}`     | Разделяем модельные типы в отдельные файлы                                   |
| **Enums**           | `kebab-case.enums.ts`   | `user-role.enums.ts`<br>внутри → `export enum UserRole { Admin, Guest }`    | Единый подход к enum-файлам                                                  |
| **Константы**       | `SCREAMING_SNAKE_CASE`  | `MIN_BET = 10`, `MAX_BET = 100`                                             | Для конфигов и фиксированных значений                                        |
| **Composables**     | `useXxx.ts`             | `useAuth.ts`, `useDevice.ts`                                                | Nuxt автоимпорт + читаемый нейминг                                           |

---

### 3. Стиль кода

- **Форматирование кода полностью отдаётся Prettier.**
- Строки до `160` символов.
- Четыре пробела (`tabWidth: 4`, `useTabs: false`).
- **JS/TS:** без `;`, одинарные кавычки, `arrowParens: always`.
- **Vue:** `<script>` и `<style>` с отступами, атрибуты можно писать в одну строку, если влезают.
- **TailwindCSS:** классы сортируются автоматически (`prettier-plugin-tailwindcss`).
- Никаких ручных завершающих запятых.
- Всегда использовать `import type` для типов.

---

#### 3.1. Порядок секций в `<script setup>`

Рекомендовано секции внутри компонента располагать в следующем порядке:

1. **Импорты** (группами)
2. **Props**
3. **Bindings** (storeToRefs, методы стора, computed, прочее)
4. **State** (ref, reactive)
5. **Computed**
6. **Methods**
7. **SEO / meta**
8. **Хуки (onMounted, onUnmounted и т. д.)**
9. **Watchers**

Пример:

```vue
<script setup lang="ts">
    // Components
    import AppLoader from '~/components/app/loaders/AppLoader.vue'

    // Composables
    import { useRoute } from '#app'
    import { useUserStore } from '~/store/user/user.store'

    // Bindings
    const { params } = useRoute()
    const { user } = storeToRefs(useUserStore())

    // State
    const isLoading = ref(true)

    // Methods
    const fetchUser = async () => {
        isLoading.value = true
        await useUserStore().fetchUser(params.id)
        isLoading.value = false
    }

    // SEO
    useSeoMeta({ title: () => user.value?.name })

    // Hooks
    onMounted(() => fetchUser())

    // Watchers
    watch(
        () => user.value?.id,
        () => console.log('User changed')
    )
</script>
```

---

#### 3.2. Импорты

- Стараемся группировать логически и разделять комментариями:

```ts
// ✅ Good
// Components
import UserCard from '~/components/user/UserCard.vue'

// Composables
import { useRoute } from '#app'

// Stores
import { useUserStore } from '~/store/user/user.store'

// Utils
import { formatDate } from '~/shared/utils/date'
```

---

#### 3.3. State

- Стараемся указывать явно типы у всех реактивных переменных

```ts
const isLoading = ref<boolean>(true)
```

---

### 4. Vue / Nuxt

- Всегда использовать `<script setup lang="ts">`.
- Props/emit — через `defineProps` и `defineEmits`.
- Компоненты всегда **PascalCase**.
- Многострочные шаблоны выравниваются по отступам.
- Хорошей практикой будет вынос props в отдельный экспортируемы интерфейс

```vue
<script setup lang="ts">
    // Interfaces
    export interface ButtonWithTextProps {
        to?: RouteLocationRaw
        text?: string
        dense?: boolean
        action?: Function
    }

    // Props
    const props = withDefaults(defineProps<ButtonWithTextProps>(), {
        dense: false
    })
</script>
```

---

### 5. TypeScript

- Не использовать `any` (eslint правило включено).
- Все публичные функции/методы должны быть типизированы.
- Типы импортировать через `import type`.
- DTO и интерфейсы хранить рядом с модулем или в `shared/types`.

---

### 6. TailwindCSS

- Используем только утилитарные классы.
- Кастомные классы допускаются, но минимизируем кастомную верстку, только по необходимости.

---

### 7. Pinia

- Используем **только Setup Stores**.
- Файлы называем `xxx.store.ts`.
- Функции стора называем `useXxxStore`.

#### Пример

```ts
// user.store.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    // state
    const user = ref<User | null>(null)
    const isLoading = ref(false)

    // getters
    const isAuthorized = computed(() => !!user.value)

    // actions
    const fetchUser = async (id: string) => {
        isLoading.value = true
        try {
            // api-запрос
            user.value = await api.getUser(id)
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        isLoading,
        isAuthorized,
        fetchUser
    }
})
```

#### Логика

1. **ref() → state**

    ```ts
    const count = ref(0) // state
    ```

2. **computed() → getters**

    ```ts
    const doubleCount = computed(() => count.value * 2) // getter
    ```

3. **function() → actions**

    ```ts
    const increment = () => {
        count.value++
    } // action
    ```

4. Только необходмые state-поля должны быть возвращены в `return {}`.
5. Можно использовать **watch** и любые composables внутри стора.
6. В сторах можно инжектить глобальные зависимости (`inject`, `useRoute` и т. д.), но учитываем SSR.

#### ❌ Нельзя

```ts
export const useUserStore = defineStore('user', {
    state: () => ({}),
    getters: {},
    actions: {}
})
```

> Опционный синтаксис (object stores) запрещён.

---

#### ✅ Можно

- Setup Stores с `ref`, `computed`, `function`.
- watchers/composables прямо в store.

---

### 8. i18n

- Все тексты — только через `$t()`.
- Локали лежат в `/i18n/{lang}.json`.
- Формат — **nested**, ключи группируются по домену и назначению.
- Ключи пишутся **snake_case**.

---

#### ✅ Правильный пример (nested)

```json
{
    "auth": {
        "title": "Login to account",
        "button": {
            "login": "Sign In",
            "register": "Register"
        }
    },
    "console": {
        "actions": {
            "next": "Next",
            "prev": "Previous",
            "play": "Play"
        }
    }
}
```

#### ❌ Неправильно (flat)

```json
{
    "auth_title": "Login to account",
    "auth_button_login": "Sign In",
    "console_actions_next": "Next"
}
```

---

#### Пример структуры файлов

```
/i18n
  en.json
  ru.json
```

**en.json**

```json
{
    "auth": {
        "title": "Login to account",
        "button": {
            "login": "Sign In",
            "register": "Register"
        }
    },
    "console": {
        "actions": {
            "next": "Next",
            "prev": "Previous"
        }
    }
}
```

**ru.json**

```json
{
    "auth": {
        "title": "Вход в аккаунт",
        "button": {
            "login": "Войти",
            "register": "Зарегистрироваться"
        }
    },
    "console": {
        "actions": {
            "next": "Далее",
            "prev": "Назад"
        }
    }
}
```

---

#### В коде

```vue
<template>
    <div>
        <h1>{{ $t('auth.title') }}</h1>
        <button>{{ $t('auth.button.login') }}</button>
        <button>{{ $t('console.actions.next') }}</button>
    </div>
</template>
```

---

### 9. Git Workflow

- Ветки: `feature/*`, `fix/*`, `chore/*`.
- Коммиты — [Conventional Commits](https://www.conventionalcommits.org/):
- В PR — линтер и тесты должны проходить.

---

### 10. Инструменты

- **ESLint** — линтинг.
- **Prettier** — автоформатирование.
