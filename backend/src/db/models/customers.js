const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const customers = sequelize.define(
    'customers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      current_period_starts: {
        type: DataTypes.DATE,
      },

      current_period_ends: {
        type: DataTypes.DATE,
      },

      addressAsProfile: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
      },

      card_token: {
        type: DataTypes.TEXT,
      },

      card_last_four_digits: {
        type: DataTypes.TEXT,
      },

      expiry_month: {
        type: DataTypes.DATEONLY,

        get: function () {
          return this.getDataValue('expiry_month')
            ? moment.utc(this.getDataValue('expiry_month')).format('YYYY-MM-DD')
            : null;
        },
      },

      card_expiry_notified: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
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

  customers.associate = (db) => {
    db.customers.belongsTo(db.subscription_plans, {
      as: 'next_subscription_plan',
      foreignKey: {
        name: 'next_subscription_planId',
      },
      constraints: false,
    });

    db.customers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.customers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return customers;
};
