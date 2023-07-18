const db = require('../db/models');
const Subscription_plansDBApi = require('../db/api/subscription_plans');

module.exports = class Subscription_plansService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Subscription_plansDBApi.create(data, {
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
      let subscription_plans = await Subscription_plansDBApi.findBy(
        { id },
        { transaction },
      );

      if (!subscription_plans) {
        throw new ValidationError('subscription_plansNotFound');
      }

      await Subscription_plansDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return subscription_plans;
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

      await Subscription_plansDBApi.remove(id, {
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
