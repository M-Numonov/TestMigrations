const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const global_settings = sequelize.define(
    'global_settings',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,

      },

subscription_expiry_notification_days: {
        type: DataTypes.INTEGER,

      },

billing_cycle_grace_period: {
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

  global_settings.associate = (db) => {

    db.global_settings.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.global_settings.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return global_settings;
};

