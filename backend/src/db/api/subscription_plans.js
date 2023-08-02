const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Subscription_plansDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const subscription_plans = await db.subscription_plans.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        trial_period: data.trial_period || null,
        billing_cycle: data.billing_cycle || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return subscription_plans;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const subscription_plans = await db.subscription_plans.findByPk(id, {
      transaction,
    });

    await subscription_plans.update(
      {
        name: data.name || null,
        trial_period: data.trial_period || null,
        billing_cycle: data.billing_cycle || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return subscription_plans;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const subscription_plans = await db.subscription_plans.findByPk(
      id,
      options,
    );

    await subscription_plans.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await subscription_plans.destroy({
      transaction,
    });

    return subscription_plans;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const subscription_plans = await db.subscription_plans.findOne(
      { where },
      { transaction },
    );

    if (!subscription_plans) {
      return subscription_plans;
    }

    const output = subscription_plans.get({ plain: true });

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
    let include = [];

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
          [Op.and]: Utils.ilike('subscription_plans', 'name', filter.name),
        };
      }

      if (filter.trial_periodRange) {
        const [start, end] = filter.trial_periodRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            trial_period: {
              ...where.trial_period,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            trial_period: {
              ...where.trial_period,
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
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.billing_cycle) {
        where = {
          ...where,
          billing_cycle: filter.billing_cycle,
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

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.subscription_plans.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.subscription_plans.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

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
          Utils.ilike('subscription_plans', 'name', query),
        ],
      };
    }

    const records = await db.subscription_plans.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
