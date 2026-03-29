import { Injectable } from "@nestjs/common";
import { PipelineStage } from "mongoose";

@Injectable()
export abstract class BaseRepository {
  public tableName;

  constructor(tableName) {
    this.tableName = tableName;
  }

  async getModel() {
    return this.tableName;
  }

  async create(data) {
    const result = new this.tableName(data);
    return result.save();
  }

  async createMany(data) {
    return this.tableName.insertMany(data);
  }

  async findOne(condition, projection = null) {
    if (projection) {
      return this.tableName.findOne(condition, projection);
    } else {
      return this.tableName.findOne(condition);
    }
  }

  async find(condition, projection = null) {
    if (projection) {
      return this.tableName.find(condition, projection);
    } else {
      return this.tableName.find(condition);
    }
  }

  async updateById(_id, payload) {
    return this.tableName.findOneAndUpdate({ _id }, payload, {
      new: true,
      upsert: true,
    });
  }

  async deleteMany(condition) {
    return this.tableName.deleteMany(condition);
  }

  async deleteOne(condition) {
    return this.tableName.deleteOne(condition);
  }

  async updateOne(condition, data) {
    return this.tableName.findOneAndUpdate(condition, data, {
      upsert: true,
      new: true,
    });
  }

  async updateOrCreate(condition, data) {
    return this.tableName.findOneAndUpdate(condition, data, {
      upsert: true,
      new: true,
    });
  }

  async updateMany(condition, data) {
    return this.tableName.updateMany(condition, data, { new: true });
  }

  public async aggregatePaginate(stages: PipelineStage[], paginationOptions) {
    const { page, perPage: limit } = paginationOptions;
    const skip = page ? (page - 1) * limit : 0;
    stages.push({
      $facet: {
        pagination: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });
    try {
      const aggregationResult = await this.tableName
        .aggregate(stages)
        .collation({ locale: "en" });
      const total = aggregationResult[0]?.pagination[0]?.total || 0;
      const hasNextPage = total - (skip + limit) > 0;

      return {
        data: aggregationResult[0].data,
        pagination: {
          total,
          currentPage: page,
          hasNextPage,
        },
      };
    } catch (e) {
      return null;
    }
  }

  public async keyPaginationAggregate(stages: PipelineStage[]) {
    return this.tableName.aggregate(stages);
  }

  async aggregate(stages) {
    const aggregationResult = await this.tableName.aggregate(stages);
    return aggregationResult;
  }
}
