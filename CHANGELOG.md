# Changelog

All notable changes to `@jjwesterkamp/event-delegation` will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Added proper path mappings in `package.json#exports` for `./lib` folder.

## [2.0.6] (2021-04-28)

### Changed

- Improved UMD bundle size.

### Added

- Added default UMD file pointers for CDN services to package.json.
- Added `"exports"` field to package.json.

### Fixed

- Removed ES2015 syntax from UMD bundles. Bundles are now compatible with ES5 environments.

## [2.0.5] (2021-04-15)

### Fixed

- Removed UMD namespace declaration from d.ts file, as it was incorrect.

  _event-delegation.d.ts_
  ```diff
  - export as namespace EventDelegation
  ```

  This was incorrectly assuming the following global shape:

  ```typescript
  const EventDelegation = {
    default: { // < this is wrong
      global() { ... },
      within() { ... },
      withinMany() { ... },
    }
  }
  ```
  When taking the UMD bundle from an npm installation you can still
  declare the types manually in a declaration file like this:
  ```typescript
  import { AskRoot } from '@jjwesterkamp/event-delegation'

  declare global {
      const EventDelegation: AskRoot
  }
  ```

## [2.0.4] (2021-04-12)

### Fixed

- Allow `boolean` type for listenerOptions.

### Other

- Updated documentation, fixed some broken links in README.

## [2.0.3] (2021-04-11)

### Internals

- Cleaned up the types strategy

  `event-delegation.d.ts` is now no longer generated from source files, making the package more lightweight
  because type declarations are not duplicated anymore.

- Bundled `lib/isFunction`, `lib/isString` and `lib/isNil` together in one file `lib/assertions`.

## [2.0.2] (2021-04-11)

- Removed sourcemaps from CommonJS and ESM builds in npm releases.
- Removed remaining unnecessary files from npm releases

## [2.0.1] (2021-04-11)

### Fixed

- Removed documentation folder from npm releases.

## [2.0.0] (2021-04-11)

No notable changes.

## [2.0.0-beta1] (2021-04-11)

### Breaking changes

- Added type inference for `event.currentTarget`

  This is technically a breaking change because this feature required the types `DelegationListener` and `DelegationEvent`
  to take an additional type argument for the root element type. However, if you never imported and used these types
  explicitly this change should not affect you.

### Added

- Method `EventDelegation.withinMany()` to explicitly create multiple listeners at once.

## [1.0.0] (2021-04-10)

### Breaking changes

- Completely rebuilt the package with a better API and improved type inference.

## [0.4.4] (2019-06-08)

### Breaking changes

- Renamed interface `DelegationListener` to `EventHandler`

### Added

- Event type parameter to `DelegationListenerFn` type constructor

## [0.4.3] (2019-06-05)

### Fixed

- Import polyfill in `closestWithin` module

## [0.4.2] (2019-02-08)

- No notable changes.

## [0.4.1] (2019-02-08)

### Fixed

- Added proper polyfill for `Element.prototype.matches()`

## [0.4.0] (2018-11-02)

### Development

- Added test suite
- Refactoring of internal code

## [0.3.0] (2018-11-02)

### Added

- Type parameters for annotating the expected type of delegator elements.

## [0.2.1] (2018-11-02)

### Added

- CDN snippet to README

### Fixed

- UMD bundle namespace

## [0.2.0] (2018-10-27)

### Added

- Added `delegator` property to events as an alternative to explicit this-binding

## [0.1.2] (2018-10-18)

- Implemented application of `listenerOptions` configuration
- README changes

## [0.1.1] (2018-10-17)

- npm ignore fix
- add npm version to README.md

## [0.1.0] (2018-10-17, Initial release)

- Initial version

[Unreleased]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.6...HEAD
[2.0.6]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.5...v2.0.6
[2.0.5]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.4...v2.0.5
[2.0.4]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.0-beta1...v2.0.0
[2.0.0-beta1]: https://github.com/JJWesterkamp/event-delegation/compare/v1.0.0...v2.0.0-beta1
[1.0.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.4...v1.0.0
[0.4.4]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/JJWesterkamp/event-delegation/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/JJWesterkamp/event-delegation/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/JJWesterkamp/event-delegation/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/JJWesterkamp/event-delegation/tree/v0.1.0
