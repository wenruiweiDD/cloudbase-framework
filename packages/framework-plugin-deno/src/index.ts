/**
 * Tencent is pleased to support the open source community by making CloudBaseFramework - 云原生一体化部署工具 available.
 *
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * Please refer to license text included with this package for license details.
 */
import { Plugin, PluginServiceApi } from '@cloudbase/framework-core';
import { plugin as ContainerPlugin } from '@cloudbase/framework-plugin-container';
import { DenoBuilder } from './builder';
import { IFrameworkPluginDenoInputs } from './types';

function resolveInputs(inputs: any, defaultInputs: any) {
  return Object.assign({}, defaultInputs, inputs);
}

class DenoPlugin extends Plugin {
  protected resolvedInputs: IFrameworkPluginDenoInputs;
  protected buildOutput: any;
  protected denoBuilder: DenoBuilder;
  protected containerPlugin: any;

  constructor(
    public name: string,
    public api: PluginServiceApi,
    public inputs: IFrameworkPluginDenoInputs
  ) {
    super(name, api, inputs);

    const DEFAULT_INPUTS = {
      dockerImage: 'debian:buster-slim',
      // runtime example: v1.3.0
      runtime: 'latest',
      // denonVersion example: @2.4.0
      denonVersion: '',
      entry: '',
      autoBuild: true,
      serviceName: 'deno-app',
      servicePath: '/deno-app',
      projectPath: '.',
    };

    this.resolvedInputs = resolveInputs(this.inputs, DEFAULT_INPUTS);

    this.denoBuilder = new DenoBuilder({
      projectPath: this.api.projectPath,
    });
  }

  /**
   * 初始化资源
   */
  async init() {
    this.api.logger.debug('DenoPlugin: init', this.resolvedInputs);
  }

  /**
   * 生成功能代码
   */
  async genCode() {}

  /**
   * 构建资源
   */
  async build() {
    this.api.logger.debug('DenoPlugin: build', this.resolvedInputs);

    const {
      projectPath,
      dockerImage,
      runtime,
      denonVersion,
      entry,
      autoBuild,
      serviceName,
      servicePath,
    } = this.resolvedInputs;

    // 构建 deno 中间产物
    this.buildOutput = await this.denoBuilder.build(projectPath || '.', {
      dockerImage,
      runtime,
      denonVersion,
      entry,
      autoBuild,
      name: serviceName,
      path: servicePath,
    });

    const container = this.buildOutput.containers[0];

    this.containerPlugin = new ContainerPlugin(
      'container',
      this.api,
      resolveInputs(
        { localAbsolutePath: container.source },
        this.resolvedInputs
      )
    );

    await this.containerPlugin.init();

    // 构建 container 最终产物
    await this.containerPlugin.build();
  }

  /**
   * 部署资源
   */
  async deploy() {
    this.api.logger.debug(
      'DenoPlugin: deploy',
      this.resolvedInputs,
      this.buildOutput
    );

    await this.containerPlugin.deploy();

    await this.denoBuilder.clean();

    this.api.logger.info(`${this.api.emoji('🚀')} Deno 应用部署成功`);
  }

  /**
   * 将资源编译成 SAM 描述
   */
  async compile() {
    this.api.logger.debug('DenoPlugin: compile', this.resolvedInputs);
    return this.containerPlugin.compile();
  }

  /**
   * 移除资源
   */
  async remove() {}

  /**
   * 执行自定义命令
   */
  async run() {}
}

export const plugin = DenoPlugin;
