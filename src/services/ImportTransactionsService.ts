import LoadCSV from './LoadCSVService';
import Transaction from '../models/Transaction';

import CreateTransaction from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransaction();
    const loadCSV = new LoadCSV();

    const lines = await loadCSV.execute(fileName);

    const transactions: Transaction[] = [];
    for (const line of lines) {
      const transaction = await createTransaction.execute({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
