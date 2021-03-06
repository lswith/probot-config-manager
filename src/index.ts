import Joi = require("joi");
import { Context } from "probot";

export class ConfigManager<T> {
  private filename: string;
  private defaultConfig: T;
  private schema: Joi.Schema;

  constructor(filename: string, defaultConfig: T, schema: Joi.Schema) {
    this.filename = filename;
    this.defaultConfig = defaultConfig;
    this.schema = schema;
  }

  public async getConfig(context: Context): Promise<T> {
    const newConfig = await context.config<T>(
      this.filename,
      this.defaultConfig
    );
    const result = this.validateConfig(newConfig);
    if (result.error) {
      const annotation = result.error.annotate();
      throw new Error(`Invalid Config: ${annotation}`);
      return {} as T;
    }
    return newConfig!;
  }

  private validateConfig(
    config: any
  ): { value: T; error?: Joi.ValidationError } {
    return Joi.validate(config, this.schema);
  }
}
