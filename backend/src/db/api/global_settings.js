
const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Global_settingsDBApi {

  static async create(data, options) {
  const currentUser = (options && options.currentUser) || { id: null };
  const transaction = (options && options.transaction) || undefined;

  const global_settings = await db.global_settings.create(
  {
  id: data.id || undefined,

    name: data.name
    ||
    null
,

    subscription_expiry_notification_days: data.subscription_expiry_notification_days
    ||
    null
,

    billing_cycle_grace_period: data.billing_cycle_grace_period
    ||
    null
,

  importHash: data.importHash || null,
  createdById: currentUser.id,
  updatedById: currentUser.id,
  },
  { transaction },
  );

  return global_settings;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || {id: null};
    const transaction = (options && options.transaction) || undefined;

    const global_settings = await db.global_settings.findByPk(id, {
      transaction,
    });

    await global_settings.update(
      {

        name: data.name
        ||
        null
,

        subscription_expiry_notification_days: data.subscription_expiry_notification_days
        ||
        null
,

        billing_cycle_grace_period: data.billing_cycle_grace_period
        ||
        null
,

        updatedById: currentUser.id,
      },
      {transaction},
    );

    return global_settings;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || {id: null};
    const transaction = (options && options.transaction) || undefined;

    const global_settings = await db.global_settings.findByPk(id, options);

    await global_settings.update({
      deletedBy: currentUser.id
    }, {
      transaction,
    });

    await global_settings.destroy({
      transaction
    });

    return global_settings;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const global_settings = await db.global_settings.findOne(
      { where },
      { transaction },
    );

    if (!global_settings) {
      return global_settings;
    }

    const output = global_settings.get({plain: true});

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [

    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'global_settings',
            'name',
            filter.name,
          ),
        };
      }

      if (filter.subscription_expiry_notification_daysRange) {
        const [start, end] = filter.subscription_expiry_notification_daysRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            subscription_expiry_notification_days: {
              ...where.subscription_expiry_notification_days,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            subscription_expiry_notification_days: {
              ...where.subscription_expiry_notification_days,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.billing_cycle_grace_periodRange) {
        const [start, end] = filter.billing_cycle_grace_periodRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            billing_cycle_grace_period: {
              ...where.billing_cycle_grace_period,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            billing_cycle_grace_period: {
              ...where.billing_cycle_grace_period,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active:
            filter.active === true ||
            filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly ? {rows: [], count: await db.global_settings.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: (filter.field && filter.sort)
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
        },
    )} : await db.global_settings.findAndCountAll(
        {
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: (filter.field && filter.sort)
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
        },
    );

//    rows = await this._fillWithRelationsAndFilesForRows(
//      rows,
//      options,
//    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike(
            'global_settings',
            'id',
            query,
          ),
        ],
      };
    }

    const records = await db.global_settings.findAll({
      attributes: [ 'id', 'id' ],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }

};

