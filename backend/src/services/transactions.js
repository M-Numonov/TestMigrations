const db = require('../db/models');
const TransactionsDBApi = require('../db/api/transactions');

module.exports = class TransactionsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await TransactionsDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let transactions = await TransactionsDBApi.findBy(
        { id },
        { transaction },
      );

      if (!transactions) {
        throw new ValidationError('transactionsNotFound');
      }

      await TransactionsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return transactions;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await TransactionsDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
