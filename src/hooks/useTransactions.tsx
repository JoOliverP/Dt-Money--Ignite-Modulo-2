import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface Trasaction {
   id: number;
   title: string;
   amount: number;
   type: string;
   category: string;
   createdAt: string;

}
// interface transactionsInput{
//    title: string;
//    amount: number;
//    type: string;
//    category: string;
// }

type TrasactionInput = Omit<Trasaction, 'id' | 'createdAt'>

// type TrasactionInput = Pick<Trasaction, 'title' | 'amount' | 'type' | 'category'>


interface TrasactionsProviderProps {
   children: ReactNode;
}

interface TrasactionsContextData {
   transactions: Trasaction[];
   createTransaction: (transaction: TrasactionInput) => Promise<void>;
}

const TrasactionsContext = createContext<TrasactionsContextData>(
   {} as TrasactionsContextData
);

export function TrasactionsProvider({ children }: TrasactionsProviderProps) {
   const [transactions, setTransactions] = useState<Trasaction[]>([]);

   useEffect(() => {
      api.get('transactions')
         .then(response => setTransactions(response.data.transactions))
   }, [])

   async function createTransaction(transactionsInput: TrasactionInput) {
      const response = await api.post('/transactions', {
         ...transactionsInput,
         createdAt: new Date(),
      })
      const { transaction } = response.data;

      setTransactions([
         ...transactions,
         transaction,
      ]);
   }

   return (
      <TrasactionsContext.Provider value={{ transactions, createTransaction }}>
         {children}
      </TrasactionsContext.Provider>
   )
}

export function useTransactions() {
   const context = useContext(TrasactionsContext);

   return context;
}