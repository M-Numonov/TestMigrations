const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const subscription_plans = sequelize.define(
    'subscription_plans',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      trial_period: {
        type: DataTypes.INTEGER,
      },

      billing_cycle: {
        type: DataTypes.ENUM,

        values: ['30', '90', '365'],
      },

      stripe_price_id: {
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

  subscription_plans.associate = (db) => {
    db.subscription_plans.belongsTo(db.subscription_plans, {
      as: 'replacement_plan',
      foreignKey: {
        name: 'replacement_planId',
      },
      constraints: false,
    });

    db.subscription_plans.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.subscription_plans.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return subscription_plans;
};
