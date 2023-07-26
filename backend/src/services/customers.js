const db = require('../db/models');
const CustomersDBApi = require('../db/api/customers');

module.exports = class CustomersService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await CustomersDBApi.create(
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let customers = await CustomersDBApi.findBy(
        {id},
        {transaction},
      );

      if (!customers) {
        throw new ValidationError(
          'customersNotFound',
        );
      }

      await CustomersDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      return customers;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError(
          'errors.forbidden.message',
        );
      }

      await CustomersDBApi.remove(
        id,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

