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
    db.subscription_plans.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.subscription_plans.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return subscription_plans;
};
