import * as requireResolve from 'resolve-pkg';

export class BabelTransform {
  config: any;
  options: any;
  babel: any;

  constructor (config = {}, options = {}) {
    this.config = {
      sourceMaps: 'both',
      ...config,
    };

    this.options = {
      servicePath       : '',
      skipOnError       : false, // When false, errors will halt execution
      logErrors         : true,
      normalizeBabelExt : false,
      ...options,
    };

    // eslint-disable-next-line
    this.babel = require(
      requireResolve('babel-core', { cwd: this.options.servicePath }),
    );
  }

  run ({ code, map, relPath }) {
    let result = { code, map, relPath };

    try {
      const transformed = this.babel.transform(code, {
        ...this.config,
        sourceFileName  : relPath,
        sourceMapTarget : relPath,
        allowJs: true
      });

      result = {
        ...result,
        ...transformed,
        relPath: this.options.normalizeBabelExt
          ? relPath.replace(/\.[^.]+$/, '.js')
          : relPath,
      };
    } catch (err) {
      // tslint:disable-next-line:no-console
      if (this.options.logErrors) { console.error(err); } // eslint-disable-line
      if (!this.options.skipOnError) { throw err; }
    }

    return result;
  }
}
