import { defineStore } from 'pinia';

interface MetaTag {
    text: string;
}

interface Account {
    id: string;
    metaRaw: string;
    meta: MetaTag[];
    type: 'local' | 'ldap';
    login: string;
    password: string | null;
}

export const useAccountStore = defineStore('account', {
    state: () => ({
        accounts: [] as Account[]
    }),
    actions: {
        save(accounts: Account[]) {
            this.accounts = accounts;
            localStorage.setItem('accounts', JSON.stringify(accounts));
        },
        load(): Account[] {
            const raw = localStorage.getItem('accounts');
            this.accounts = raw ? JSON.parse(raw) : [];
            return this.accounts;
        }
    }
});