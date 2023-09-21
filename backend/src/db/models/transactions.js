const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const transactions = sequelize.define(
    'transactions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      amount: {
        type: DataTypes.TEXT,
      },

      quantity: {
        type: DataTypes.INTEGER,
      },

      receipt_url: {
        type: DataTypes.TEXT,
      },

      subscription_plan_name: {
        type: DataTypes.TEXT,
      },

      subscription_plan_status: {
        type: DataTypes.TEXT,
      },

      subscription_plan_type: {
        type: DataTypes.TEXT,
      },

      subscription_plan_activation_date: {
        type: DataTypes.TEXT,
      },

      subscription_plan_expiry_date: {
        type: DataTypes.TEXT,
      },

      customer_name: {
        type: DataTypes.TEXT,
      },

      customer_company_name: {
        type: DataTypes.TEXT,
      },

      customer_email: {
        type: DataTypes.TEXT,
      },

      customer_phone_number: {
        type: DataTypes.TEXT,
      },

      customer_country: {
        type: DataTypes.TEXT,
      },

      customer_city: {
        type: DataTypes.TEXT,
      },

      customer_address: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  transactions.associate = (db) => {
    db.transactions.belongsTo(db.subscription_plans, {
      as: 'subscriptionPlan',
      foreignKey: {
        name: 'subscriptionPlanId',
      },
      constraints: false,
    });

    db.transactions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.transactions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return transactions;
};
