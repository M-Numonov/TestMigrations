module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('subscription_plans', 'billing_cycle', {
        transaction,
      });

      await queryInterface.addColumn(
        'subscription_plans',
        'billing_cycle',
        {
          type: Sequelize.DataTypes.ENUM,

          values: ['30', '90', '365'],
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    /**
     * @type {Transaction}
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('subscription_plans', 'billing_cycle', {
        transaction,
      });

      await queryInterface.addColumn(
        'subscription_plans',
        'billing_cycle',
        {
          type: Sequelize.DataTypes.ENUM,

          values: ['monthly', 'yearly'],
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
