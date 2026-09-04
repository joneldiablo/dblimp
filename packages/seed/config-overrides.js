// CRA sets `resolve.fullySpecified` for ESM, forcing explicit file extensions for
// ESM-only packages. The `@dblimp` workspace packages ship ESM with extensionless
// relative imports (emitted by tsc with the `bundler` module resolution), so we
// disable the strict enforcement.
module.exports = function override(config, env) {
  config.resolve = config.resolve || {};
  config.resolve.fullySpecified = false;

  const walk = (rule) => {
    if (!rule) return;
    rule.resolve = rule.resolve || {};
    rule.resolve.fullySpecified = false;
    if (rule.oneOf) rule.oneOf.forEach(walk);
    if (Array.isArray(rule.rules)) rule.rules.forEach(walk);
  };
  if (Array.isArray(config.module?.rules)) config.module.rules.forEach(walk);
  return config;
};