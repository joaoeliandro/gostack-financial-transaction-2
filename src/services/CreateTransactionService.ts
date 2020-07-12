import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoryRepository';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const currentBalance = await transactionsRepository.getBalance();
    const availableBalance = currentBalance.total;

    if (type === 'outcome' && value > availableBalance) {
      throw new AppError('Not enough balance');
    }

    const categoryObj = await categoriesRepository.getOrCreateByTitle(category);

    const transaction = transactionsRepository.create({
      title,
      value: Number(value),
      type,
      category_id: categoryObj.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
