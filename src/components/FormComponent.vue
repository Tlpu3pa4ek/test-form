<template>
  <div class="p-6 space-y-4">
    <div class="flex gap-3 justify-between align-items-center">
      <h2 class="text-2xl font-bold">Учетные записи</h2>
      <Button icon="pi pi-plus" @click="addAccount" />
    </div>

    <div class="text-sm text-gray-500">
      <i class="pi pi-info-circle mr-2" />Для указания нескольких меток для одной пары логин/пароль используйте разделитель <code>;</code>
    </div>

    <div
        v-for="(account, index) in accounts"
        :key="account.id"
        class="grid grid-cols-5 gap-4 align-items-center items-center border p-4 rounded shadow-sm"
    >

        <InputText
            v-model="account.metaRaw"
            :class="{ 'p-invalid': accountErrors[index]?.meta }"
            placeholder="Метки"
            @blur="onMetaBlur(index)"
            maxlength="50"
        />


        <Dropdown
            v-model="account.type"
            :options="typeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Тип"
            @change="onTypeChange(index)"
        />


        <InputText
            v-model="account.login"
            :class="{ 'p-invalid': accountErrors[index]?.login }"
            placeholder="Логин"
            maxlength="100"
            @blur="validateAccount(index)"
        />


        <Password
            v-if="account.type === 'local'"
            v-model="account.password"
            :class="{ 'p-invalid': accountErrors[index]?.password }"
            placeholder="Пароль"
            toggleMask
            maxlength="100"
            @blur="validateAccount(index)"
        />

        <Button icon="pi pi-trash" severity="danger" @click="removeAccount(index)" />

    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useAccountStore} from '../stores/accountStore.ts';
import {nanoid} from 'nanoid';

interface Account {
  id: string;
  metaRaw: string;
  meta: { text: string }[];
  type: 'local' | 'ldap';
  login: string;
  password: string | null;
}

interface ErrorState {
  meta: boolean;
  login: boolean;
  password: boolean;
}

const store = useAccountStore();
const accounts = ref<Account[]>([]);
const accountErrors = ref<Record<number, ErrorState>>({});

const typeOptions = [
  { label: 'Локальная', value: 'local' },
  { label: 'LDAP', value: 'ldap' },
];

const validateAccount = (index: number) => {
  const account = accounts.value[index];
  const errors: ErrorState = {
    meta: false,
    login: false,
    password: false,
  };

  if (!account.metaRaw || account.metaRaw.trim().length === 0 || account.metaRaw.length > 100) {
    errors.meta = true;
  }
  if (!account.login || account.login.trim().length === 0 || account.login.length > 100) {
    errors.login = true;
  }

  if (account.type === 'local' && (!account.password || account.password.trim().length === 0 || account.password.length > 100)) {
    errors.password = true;
  }

  accountErrors.value[index] = errors;

  saveValidAccounts();
};

const saveValidAccounts = () => {
  const validAccounts = accounts.value.filter((acc, i) => {
    const err = accountErrors.value[i];
    return err && !err.meta && !err.login && !err.password;
  });
  store.save(validAccounts);
};

const onTypeChange = (index: number) => {
  const account = accounts.value[index];
  if (account.type === 'ldap') {
    account.password = null;
  } else {
    account.password = '';
  }
  validateAccount(index);
};

const onMetaBlur = (index: number) => {
  const raw = accounts.value[index].metaRaw;
  accounts.value[index].meta = raw
      .split(';')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((text) => ({text}));
  validateAccount(index);
};

const addAccount = () => {
  accounts.value.push({
    id: nanoid(),
    metaRaw: '',
    meta: [],
    type: 'local',
    login: '',
    password: '',
  });
};

const removeAccount = (index: number) => {
  accounts.value.splice(index, 1);
  delete accountErrors.value[index];
  saveValidAccounts();
};

onMounted(() => {
  accounts.value = store.load();
  accounts.value.forEach((_, i) => validateAccount(i));
});
</script>

<style scoped>
.p-invalid {
  border-color: #f87171;
}
</style>


<!--<template>-->
<!--  <div class="p-container p-4">-->
<!--    <div class="col-12 mx-auto">-->
<!--      <div class="flex align-items-center">-->
<!--        <h2 class="text-2xl font-bold p-2">Учетные записи</h2>-->
<!--        <div class="flex align-items-center p-2">-->
<!--          <Button icon="pi pi-plus" @click="addAccount" />-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="text-sm text-gray-500">-->
<!--        <InlineMessage icon="pi pi-question-circle" severity="info">Для указания нескольких меток для одной пары логин/пароль используйте разделитель "<strong style="font-weight: 700; font-size: 1.4rem;">;</strong>"</InlineMessage>-->
<!--      </div>-->


<!--      <div v-for="(account, index) in accounts" :key="account.id" class="flex align-items-end border p-3 rounded shadow-sm">-->
<!--        &lt;!&ndash; Метки &ndash;&gt;-->
<!--          <div class="flex flex-column mr-3">-->
<!--            <label> Метки</label>-->
<!--            <InputText-->
<!--                :class="accountErrors[index]?.meta? ' p-invalid' : ''"-->
<!--                v-model="account.metaRaw"-->
<!--                placeholder="Метки"-->
<!--                @blur="onMetaBlur(index)"-->
<!--                maxlength="50"-->
<!--            />-->
<!--          </div>-->


<!--        &lt;!&ndash; Тип записи &ndash;&gt;-->
<!--        <div class="w-2 mr-3 flex flex-column">-->
<!--          <label> Тип записи</label>-->
<!--          <Dropdown-->
<!--              class="w-full"-->
<!--              v-model="account.type"-->
<!--              :options="typeOptions"-->
<!--              optionLabel="label"-->
<!--              optionValue="value"-->
<!--              placeholder="Тип"-->
<!--              @change="onTypeChange(index)"-->
<!--          />-->
<!--        </div>-->


<!--        &lt;!&ndash; Логин &ndash;&gt;-->
<!--        <div v-if="account.type === 'local'" class="login mr-3 flex flex-column">-->
<!--          <label> Логин</label>-->
<!--          <InputText-->
<!--              :class="accountErrors[index]?.login? 'p-invalid' : ''"-->
<!--              v-model="account.login"-->
<!--              placeholder="Логин"-->
<!--              maxlength="100"-->
<!--              @blur="validateAccount(index)"-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; Логин &ndash;&gt;-->
<!--        <div v-if="account.type !== 'local'" class="w-5 mr-3 flex flex-column">-->
<!--          <label> Логин</label>-->
<!--          <InputText-->
<!--              :class="accountErrors[index]?.login? 'p-invalid' : ''"-->
<!--              v-model="account.login"-->
<!--              placeholder="Логин"-->
<!--              maxlength="100"-->
<!--              @blur="validateAccount(index)"-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; Пароль &ndash;&gt;-->
<!--        <div v-if="account.type === 'local'" class="password mr-3 flex flex-column">-->
<!--          <label> Пароль</label>-->
<!--          <Password-->
<!--              :class="accountErrors[index]?.password? ' p-invalid' : ''"-->
<!--              :feedback="false"-->
<!--              v-model="account.password"-->
<!--              placeholder="Пароль"-->
<!--              toggleMask-->
<!--              maxlength="100"-->
<!--              @blur="validateAccount(index)"-->
<!--          />-->
<!--        </div>-->

<!--        &lt;!&ndash; Удалить &ndash;&gt;-->
<!--        <div class="text-right">-->
<!--          <Button icon="pi pi-trash" severity="danger" @click="removeAccount(index)" />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import {onMounted, ref} from "vue";-->
<!--import { nanoid } from 'nanoid';-->
<!--import { useAccountStore } from '../stores/accountStore.ts';-->

<!--interface Account {-->
<!--  id: string;-->
<!--  metaRaw: string;-->
<!--  meta: { text: string }[];-->
<!--  type: 'local' | 'ldap';-->
<!--  login: string;-->
<!--  password: string | null;-->
<!--}-->

<!--interface ErrorState {-->
<!--  meta: boolean;-->
<!--  login: boolean;-->
<!--  password: boolean;-->
<!--}-->

<!--const store = useAccountStore();-->
<!--const accounts = ref<Account[]>([])-->
<!--const accountErrors = ref<Record<number, ErrorState>>({});-->

<!--const typeOptions = [-->
<!--  { label: 'Локальная', value: 'local' },-->
<!--  { label: 'LDAP', value: 'ldap' }-->
<!--]-->


<!--const onTypeChange = (index: number) => {-->
<!--  const account = accounts.value[index]-->
<!--  if (account.type === 'ldap') {-->
<!--    account.password = null-->
<!--  } else {-->
<!--    account.password = ''-->
<!--  }-->
<!--  validateAccount(index)-->
<!--}-->

<!--const onMetaBlur = (index: number) => {-->
<!--  const raw = accounts.value[index].metaRaw-->
<!--  const tags = raw-->
<!--      .split(';')-->
<!--      .map((t) => t.trim())-->
<!--      .filter((t) => t.length > 0)-->
<!--      .map((text) => ({ text }))-->
<!--  accounts.value[index].meta = tags-->
<!--  validateAccount(index)-->
<!--}-->

<!--const validateAccount = (index: number) => {-->
<!--  const account = accounts.value[index]-->
<!--  const errors: ErrorState = {-->
<!--    meta: false,-->
<!--    login: false,-->
<!--    password: false-->
<!--  }-->

<!--  if (!account.login || account.login.trim().length === 0) {-->
<!--    errors.login = true-->
<!--  }-->

<!--  if (account.type === 'local' && (!account.password || account.password.trim().length === 0)) {-->
<!--    errors.password = true-->
<!--  }-->

<!--  accountErrors.value[index] = errors-->
<!--  if (!errors.login && !errors.password) {-->
<!--    store.save(accounts.value)-->
<!--  }-->
<!--}-->

<!--const addAccount = () => {-->
<!--  accounts.value.push({-->
<!--    id: nanoid(),-->
<!--    metaRaw: '',-->
<!--    meta: [],-->
<!--    type: 'local',-->
<!--    login: '',-->
<!--    password: ''-->
<!--  })-->
<!--}-->

<!--const removeAccount = (index: number) => {-->
<!--  accounts.value.splice(index, 1)-->
<!--  delete accountErrors.value[index]-->
<!--  store.save(accounts.value)-->
<!--}-->


<!--onMounted(() => {-->
<!--  accounts.value = store.load();-->
<!--});-->

<!--</script>-->

<!--<style scoped>-->
<!--.p-invalid {-->
<!--  border-color: #f87171;-->
<!--}-->
<!--</style>-->
