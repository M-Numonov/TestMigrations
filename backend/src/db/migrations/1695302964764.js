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
      await queryInterface.addColumn(
        'transactions',
        'subscription_plan_name',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'subscription_plan_status',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'subscription_plan_type',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'subscription_plan_activation_date',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'subscription_plan_expiry_date',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_name',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_company_name',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_email',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_phone_number',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_country',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_city',
        {
          type: Sequelize.DataTypes.TEXT,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'transactions',
        'customer_address',
        {
          type: Sequelize.DataTypes.TEXT,
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
      await queryInterface.removeColumn('transactions', 'customer_address', {
        transaction,
      });

      await queryInterface.removeColumn('transactions', 'customer_city', {
        transaction,
      });

      await queryInterface.removeColumn('transactions', 'customer_country', {
        transaction,
      });

      await queryInterface.removeColumn(
        'transactions',
        'customer_phone_number',
        { transaction },
      );

      await queryInterface.removeColumn('transactions', 'customer_email', {
        transaction,
      });

      await queryInterface.removeColumn(
        'transactions',
        'customer_company_name',
        { transaction },
      );

      await queryInterface.removeColumn('transactions', 'customer_name', {
        transaction,
      });

      await queryInterface.removeColumn(
        'transactions',
        'subscription_plan_expiry_date',
        { transaction },
      );

      await queryInterface.removeColumn(
        'transactions',
        'subscription_plan_activation_date',
        { transaction },
      );

      await queryInterface.removeColumn(
        'transactions',
        'subscription_plan_type',
        { transaction },
      );

      await queryInterface.removeColumn(
        'transactions',
        'subscription_plan_status',
        { transaction },
      );

      await queryInterface.removeColumn(
        'transactions',
        'subscription_plan_name',
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
