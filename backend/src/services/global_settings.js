const db = require('../db/models');
const Global_settingsDBApi = require('../db/api/global_settings');

module.exports = class Global_settingsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Global_settingsDBApi.create(
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
      let global_settings = await Global_settingsDBApi.findBy(
        {id},
        {transaction},
      );

      if (!global_settings) {
        throw new ValidationError(
          'global_settingsNotFound',
        );
      }

      await Global_settingsDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      return global_settings;

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

      await Global_settingsDBApi.remove(
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

