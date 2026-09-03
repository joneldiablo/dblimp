# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2026-09-03

### Added

- Initial port of the `cms-dbl-components` JSON-template components to
  TypeScript as `@dblimp/cms`.
- 11 template components: `ArticlesList`, `BlogPost`, `CalendarField`,
  `CardNavigation`, `CardPanelNavigation`, `CardPlans`, `CardService`,
  `CmsTemplate`, `EndpointLoader`, `HeaderBlog`, `Notifications`,
  `OpeningHours`.
- `Image` higher-order component (`withSrc`) that rewrites `/assets` URLs
  based on the current environment.
- `registerCmsComponents()` bootstraps the Goat component registry with the
  CMS component types via `addComponents`.
- `utils/assets` and `utils/find-scrollable-parent` helpers.

[0.0.2]: https://github.com/joneldiablo/dblimp/releases/tag/v0.0.2