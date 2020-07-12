import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Response {
  deleted: true;
}

class DeleteTransactionService {
  public async execute(transactionId: string): Promise<Response> {
    const transactionsRepository = getRepository(Transaction);

    const transaction = await transactionsRepository.findOne(transactionId);

    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    await transactionsRepository.remove(transaction);

    return { deleted: true };
  }
}

export default DeleteTransactionService;
