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
